(function () {
    let $sid = location.search.substring(1).split("=")[1];
    // 小图包括小图和小放大镜
    const $spic = $("#spic");
    const $smallpic = $("#smallpic");
    const $bpic = $("#bpic");
    const $title = $('.loadtitle');
    const $price = $('.loadpcp');

    if (!$sid) {
        $sid = 1;
    }

    $.ajax({
        url: "http://localhost:8088/htdocs/my/php/getsid.php",
        data: {
            sid: $sid
        },
        dataType: 'json'
    }).done(function (d) {
        console.log(d);
        // 渲染，结果html 中有只需添加属性
        $smallpic.attr('src', d.url);
        $smallpic.attr('sid', d.sid); //图片添加sid是为了添加到购物车时，根据sid找到该商品
        $bpic.attr('src', d.url);
        $title.html(d.title);
        $price.html(d.price);


        // 渲染spic下的展示部分
        let $picarr = d.piclisturl.split(",");
        let $strhtml = "";
        $.each($picarr, function (index, value) {
            $strhtml += '<li><img src="' + value + '"/></li>';
        });
        $('#list ul').html($strhtml);
    })


    const $sf = $("#sf");
    const $bf = $("#bf");
    const $left = $('#left'); //左箭头
    const $right = $('#right'); //右箭头
    const $list = $('#list'); //小图列表
    // const $bpic = $("#bpic");
    // 先确定小放大镜宽高，以及放大比例
    // 小放/大放=小图/大图
    // console.log($bf.width()); 400px
    // console.log($bpic.width());  800px


    $sf.width($bf.width() * $spic.width() / $bpic.width());
    $sf.height($bf.height() * $spic.height() / $bpic.height());
    const $bili = $bpic.width() / $spic.width();

    $spic.hover(function () {
        $sf.css("visibility", "visible");
        $bf.css("visibility", "visible");
        $(this).on("mousemove", function (ev) {
            let $leftvalue = ev.pageX - $spic.offset().left - $sf.width() / 2;
            let $topvalue = ev.pageY - $spic.offset().top - $sf.height() / 2;
            // let $leftvalue = ev.pageX - $('.goodsinfo').offset().left - $sf.width() / 2;
            // let $topvalue = ev.pageY - $('.goodsinfo').offset().top - $sf.height() / 2;
            if ($leftvalue < 0) {
                $leftvalue = 0;
            } else if ($leftvalue >= $spic.width() - $sf.width()) {
                $leftvalue = $spic.width() - $sf.width();
            }

            if ($topvalue < 0) {
                $topvalue = 0;
            } else if ($topvalue >= $spic.height() - $sf.height()) {
                $topvalue = $spic.height() - $sf.height();
            }
            $sf.css({
                left: $leftvalue,
                top: $topvalue
            })
            $bpic.css({
                left: -$bili * $leftvalue,
                top: -$bili * $topvalue
            })

        })
    }, function () {
        $sf.css("visibility", "hidden");
        $bf.css("visibility", "hidden");
    });

    // 渲染出来的部分，用事件委托
    $("#list ul").on("click", "li", function () {
        let $imgurl = $(this).find("img").attr("src");
        $smallpic.attr("src", $imgurl);
        $bpic.attr("src", $imgurl);
    });

    let $num = 6; //列表显示的图片个数
    $right.on("click", function () {
        let $listItem = $('#list ul li');
        // $num一直在变大,当num等于li长度时，不能再点击了，if里的内容不执行
        if ($listItem.size() > $num) {
            $num++;
            $left.css('color', '#333');
            if ($listItem.size() == $num) {
                $right.css('color', '#fff');
            }
            $("#list ul").animate({
                left: -($num - 6) * $listItem.eq(0).outerWidth()
            })
        }
    })

    $left.on("click", function () {
        let $listItem = $('#list ul li');
        if ($num > 6) {
            $num--;
            $right.css('color', '#333');
            if ($num <= 6) {
                $left.css('color', '#fff');
            }
            $("#list ul").animate({
                left: -($num - 6) * $listItem.eq(0).outerWidth()
            })
        }

    })




    // 加入购物车主要存储商品sid和购买数量
    let sidArr = [];
    let howManyArr = []; //购买数量

    //必须要取出cookie,才能判断是第一次还是多次点击
    function cookietoarray() {
        if (jscookie.get('sid') && jscookie.get('howMany')) {
            sidArr = jscookie.get('sid').split(','); //获取cookie 同时转换成数组。[1,2,3,4]
            howManyArr = jscookie.get('howMany').split(','); //获取cookie 同时转换成数组。[12,13,14,15]
        } else {
            sidArr = [];
            howManyArr = [];
        }
    }

    // 点击”加入购物车“
    $(".p-btn a").on("click", function () {
        var $sidCurrent = $(this).parents(".goodsinfo").find("#smallpic").attr("sid");
        cookietoarray(); //cookie取出来
        if ($.inArray($sidCurrent, sidArr) == -1) { //当前商品sid未存入，第一次点击加入购物车
            sidArr.push($sidCurrent);
            jscookie.add("sid", sidArr, 10);
            howManyArr.push($('#count').val()); //将数量push到arrnum数组中
            jscookie.add('howMany', howManyArr, 10);
        } else { //不是第一次点击    $.inArray($sidCurrent, sidArr)，cookie里的值以及通过cookietoarray()取到本地数组里了
            let $totalNum = parseInt(howManyArr[$.inArray($sidCurrent, sidArr)]) + parseInt($("#count").val());
            // console.log(parseInt(jscookie.get($sidCurrent))); //这里不用用这个找到cookie里sid对应的数量，该get方法不能实现
            // console.log(parseInt($("#count").val()));
            // console.log(parseInt($.inArray($sidCurrent, sidArr)));//$.inArray()方法返回$sidCurrent在sidArr的index


            howManyArr[$.inArray($sidCurrent, sidArr)] = $totalNum;
            jscookie.add("howMany", howManyArr, 10);
        }

    })


})(jQuery)