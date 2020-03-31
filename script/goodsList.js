(function ($) {
    const $list = $('.list');
    // 排序中
    let array = [];
    // 排序前,主要是用于默认按钮时，数组依旧按照数据库顺序渲染
    let array_default = [];
    // 排序时用于交换两个变量
    let p = null;
    let n = null;


    $.ajax({
        url: 'http://localhost:8088/htdocs/my/php/goodsList.php',
        dataType: 'json'
    }).done(function (data) {
        // console.log(data);
        let strhtml = '';
        strhtml = "<ul>";
        // 注意这里each使用,如果是原生js，则放在each方法里作参数
        $.each(data, function (index, ele) {
            //加上price类是排序时候，可以找到该元素 
            strhtml += `
                <li>
                   <a href="detail.html?sid=${ele.sid}" target="_blank">
                        <img src='${ele.url}' class='lazy' width='200px' height='200px'/>
                        <p>${ele.sid}${ele.title}</p>
                        <p><span class="price">￥${ele.price}</span></p>
                        <p>${ele.salenumber}</p>
                   </a>
                </li>
            `;
        })
        strhtml += "</ul>";
        $list.html(strhtml);


        // li元素先全部放进数组里
        // 注意这里each使用,如果是类似于.list ul li选择器，则放在each方法点之前
        $('.list ul li').each(function (index, ele) {
            array[index] = $(this);
            array_default[index] = $(this);
        })

        // 分页：先将要跳转的页码传给后端page
        $('.page').pagination({
            pageCount: 3,
            jump: true, //跳到指定页数
            coping: true, //开启首位页
            homePage: "首页",
            endPage: "尾页",
            prevContent: "上一页",
            nextContent: "下一页",
            callback: function (api) {
                $.ajax({
                    url: 'http://localhost:8088/htdocs/my/php/goodsList.php',
                    data: {
                        page: api.getCurrent()
                    },
                    dataType: 'json'
                }).done(function (data) {
                    // console.log(api.getCurrent());
                    let $strhtml = '<ul>';
                    $.each(data, function (index, value) {
                        $strhtml += `
                        <li>
                            <a href="detail.html?sid=${value.sid}" target="_blank">
                                <img src="${value.url}"/>
                                <p>${value.sid}${value.title}</p>
                                <span class="price">￥${value.price}</span>
                                <span>${value.salenumber}</span>
                            </a>
                        </li>
                    `;
                    });
                    $strhtml += '</ul>';
                    $list.html($strhtml);

                    // 每次翻页后也需要把li放进数组里，用于排序
                    array = [];
                    array_default = [];
                    // li元素先全部放进数组里
                    // 注意这里each使用,如果是类似于.list ul li选择器，则放在each方法点之前
                    $('.list ul li').each(function (index, ele) {
                        array[index] = $(this);
                        array_default[index] = $(this);
                    })
                })

            }
        })


        // 默认排序
        $('button').eq(0).on('click', function () {
            $('.list ul').empty();
            $.each(array_default, function (index, ele) {
                $('.list ul').append(ele);
            })
        })
        // 升序
        $('button').eq(1).on('click', function () {
            // 使用冒泡排序。按照价格
            for (let i = 0; i < array.length - 1; i++) {
                for (let j = 0; j < array.length - 1 - i; j++) {
                    // p = array[j].find(".price").html().substring(1);
                    // n = array[j + 1].find(".price").html().substring(1);
                    // 这里转成数字类型才能比较
                    p = parseFloat(array[j].find(".price").html().substring(1));
                    n = parseFloat(array[j + 1].find(".price").html().substring(1));
                    // console.log(p, n);

                    // 比较的是价格大小，实际交换的是li
                    if (p > n) {
                        let temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;
                    }
                }
            }
            // 先清空，再把排序好的数组append进ul里
            $('.list ul').empty();
            $.each(array, function (index, ele) {
                $('.list ul').append(ele);
            })


        })
        // 降序
        $('button').eq(2).on('click', function () {
            for (let i = 0; i < array.length - 1; i++) {
                for (let j = 0; j < array.length - 1 - i; j++) {
                    p = parseFloat(array[j].find(".price").html().substring(1));
                    n = parseFloat(array[j + 1].find(".price").html().substring(1));

                    if (p < n) {
                        let temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;
                    }
                }
            }
            $('.list ul').empty();
            $.each(array, function (index, ele) {
                $('.list ul').append(ele);
            })
        })
    })
})(jQuery)