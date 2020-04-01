(function ($) {
    let arrsid = [];
    let arrnum = [];

    function showList(sid, num) { // id和数量
        $.ajax({
            url: "http://localhost:8088/htdocs/my/php/alldata.php",
            dataType: 'json'
        }).done(function (d) {
            $.each(d, function (index, value) {
                if (sid == value.sid) {

                    let $cloneNode = $(".cart-list").find(".goods-item:hidden").clone(true, true);
                    $cloneNode.find(".i-goods .goods-pic").find("img").attr("src", value.url);
                    $cloneNode.find('.i-goods .goods-pic').find('img').attr('sid', value.sid);
                    $cloneNode.find('.i-goods .goods-d-info').find('a').html(value.title);
                    $cloneNode.find('.i-prices').find('strong').html(value.price);
                    $cloneNode.find('.i-quantity .quantity-form').find('input').val(num);
                    // 单个商品价格
                    $cloneNode.find('.i-sum').find('strong').html((value.price * num).toFixed(2));
                    $cloneNode.css("display", "block");
                    // console.log($cloneNode);

                    $(".cart-list").append($cloneNode);
                    calcTotalPrice();
                }
            })

        })
    }

    // 渲染列表
    if (jscookie.get("sid") && jscookie.get("howMany")) {
        let s = jscookie.get("sid").split(","); //转成数组
        let h = jscookie.get("howMany").split(",");
        $.each(s, function (index, value) {
            showList(s[index], h[index]);
        })
    }

    function calcTotalPrice() {
        // 商品件数/总价
        let $sum = 0;
        let $count = 0;

        $(".cart-list .goods-item:visible").each(function (index, value) {
            // 被勾选则计算总价
            // 遍历的value是个dom节点，要使用find方法，必须用$()转成jQuery
            // 通过输出调试，发现判断没有进入，原因：.i-goods没加“.”，没有选择上
            if ($(value).find(".i-goods .cart-checkbox input").prop("checked")) {
                $sum += parseInt($(value).find('.quantity-form input').val());
                $count += parseFloat($(value).find('.i-sum strong').html());
            }
        });
        // Bug:下面两个变量为0
        // console.log($sum);
        // console.log($count);

        $(".b-sum").find('em').html($sum);
        $(".b-price-sum").find(".totalprice").html($count.toFixed(2));
    }

    // 找到所有的全选按钮（head和footer两个位置）allsel
    $(".allsel").on("change", function () {
        // 找到.goods-item（也就是商品列）下所有的复选框
        $(".goods-item:visible").find(":checkbox").prop("checked", $(this).prop("checked"));
        // 还有将另一个allsel改变checked
        $(".allsel").prop("checked", $(this).prop("checked"))
    })

    // 实现单独点击商品勾选时，全选checked属性变化
    // 委托
    let inputs = $(".goods-item:visible").find("input:checkbox");
    console.log(inputs); //?????

    $(".goods-item").on("change", inputs, function () {
        if ($(".goods-item:visible").find("input:checked") == $(".goods-item:visible").find(":checkbox").length) {
            $(".allsel").prop("checked", true);
        } else {
            $(".allsel").prop("checked", false);
        }
        calcTotalPrice();
    })

    // 点击加减改变购买数量
    $(".quantity-add").on("click", function () {
        let $num = $(this).parents(".goods-item").find(".quantity-form input").val();
        $num++;
        $(this).parents('.goods-item').find('.quantity-form input').val($num);
        $(this).parents('.goods-item').find('.i-sum strong').html(calcSinglePrice($(this)));
        calcTotalPrice();
        setCookie($(this));
    })

    $(".quantity-down").on("click", function () {
        $num = $(this).parents(".goods-item").find('.quantity-form input').val();
        $num--;
        if ($num < 1) {
            $num = 1;
        }
        $(this).parents('.goods-item').find('.quantity-form input').val($num);
        $(this).parents('.goods-item').find('.i-sum strong').html(calcSinglePrice($(this)));
        calcTotalPrice();
        setCookie($(this));

    })
    // 通过input输入改变购买数量
    $(".goods-item .quantity-form input").on("input", function () {
        // 输入的必须是数字
        let $reg = /^\d+$/g;
        let $value = $(this).val();
        if (!$reg.test($value)) {
            $(this).val(1); //不是数字默认“1”
        }
        $(this).parents('.goods-item').find('.i-sum strong').html(calcSinglePrice($(this)));
        calcTotalPrice();
        setCookie($(this));
    })

    // 计算单个商品的小计  single是jQuery对象
    function calcSinglePrice(single) {
        let $num = parseInt(single.parents(".goods-item").find('.quantity-form input').val());
        let $danjia = parseFloat(single.parents('.goods-item').find('.i-prices strong').html());
        return ($danjia * $num).toFixed(2);
    }


    // BUG：cookie没有更新
    function setCookie(jquery0) {
        cookieToArr();
        // 1.   3句代码逻辑没有错误，parents里只能是一个.goods-item.  不能是goods-item .goods-pic这种
        let $sid = jquery0.parents(".goods-item").find(".goods-pic img").attr("sid");
        let $index = $.inArray($sid, arrsid);
        arrnum[$index] = jquery0.parents(".goods-item").find('.quantity-form input').val();
        jscookie.add("howMany", arrnum, 10);
    }

    function cookieToArr() {
        if (jscookie.get("sid") && jscookie.get("howMany")) {
            arrsid = jscookie.get("sid").split(",");
            arrnum = jscookie.get("howMany").split(",");
        } else {
            arrsid = [];
            arrnum = [];
        }
    }

    function delCookie(sid, arrsid) {
        // 获取需要删除所在sid的index位置
        let $index = 0;
        $.each(arrsid, function (index, value) {
            if (value == sid) {
                $index = index;
            }
        })
        arrsid.splice($index, 1);
        arrnum.splice($index, 1);
        // 更新cookie
        jscookie.add('sid', arrsid, 10);
        jscookie.add('howMany', arrnum, 10);
    }
    // 删除商品,删除结构同时还需要在cookie里删除
    $(".goods-item .i-action").on("click", function () {
        // 取出cookie数组
        cookieToArr();
        if (window.confirm("are you sure?")) {
            $(this).parents(".goods-item").remove();
            delCookie($(this).parents(".goods-item .goods-pic").find("img").attr("sid"), arrsid);
            calcTotalPrice();
        }
    })

    // "删除选中商品"按钮   实现除删多个 
    $(".floatbar .b-delgoods a").on("click", function () {
        cookieToArr();
        if (window.confirm("Are you sure?")) {

            $(".goods-item:visible").each(function () {
                if ($(this).find(":checkbox").is(":checked")) {   //is判断是否为选中
                    $(this).remove();
                    delCookie($(this).find(".goods-pic img").attr("sid"), arrsid);
                }
            })
            calcTotalPrice();
        }
    })
    $(".floatbar").find(":checkbox").on("change",function(){
        if($(".floatbar .b-checkbox").find(":checkbox").is(":checked")){
            calcTotalPrice();
        }else{
            $(".floatbar .b-sum em").html(0);
            $(".floatbar .b-price-sum .totalprice").html(0);
        }
    })

})(jQuery)