;
(function ($) {
    // let aShow = document.querySelectorAll(".shortcut_show");
    // let aLi = document.querySelectorAll(".shortcut .fr > li");
    // for (let i = 0; i < aLi.length; i++) {
    //     console.log(2);

    //     aShow[i].onclick = function () {
    //         aShow[i].style.display = "block";
    //         console.log(1);

    //     }
    // }
    let $li = $('.fs .left > ul > li');
    let $cartlist = $('.fs .left .cartlist');
    // 每个li对应的item
    let $item = $('.fs .left .cartlist .item');

    $li.on('mouseover', function () {
        $(this).addClass("active").siblings('li').removeClass("active");
        $cartlist.show();

        // cartlist随着鼠标滚动top改变（向下滚动鼠标选择li时，会掩盖cartlist）
        

        $item.eq($(this).index()).show().siblings('.item').hide();
    })
    $li.on('mouseout', function () {
        $(this).removeClass("active");
        $cartlist.hide();
    })
    $cartlist.on('mouseover',function(){
        $(this).show();
    })
    $cartlist.on('mouseout',function(){
        $(this).hide();
    })
})(jQuery);