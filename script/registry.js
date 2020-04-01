;

(function ($) {
    // 主要限制不合规的注册信息
    let $user = $(".username");
    let $flag = true;
    $user.on("blur", function () {
        $.ajax({
            url: "http://localhost:8088/htdocs/my/php/registry.php",
            type: "post",
            data: {
                username: $user.val()
            }
        }).done(function (result) {
            if ($user.val() == "") {
                $(".tishi").html("用户名不能为空").css("color", "red")
                $flag = false;
            }
            
            // 没有重名
            if (!result) {
                $(".tishi").html("√").css("color", "green")
                $flag = true;
            } else {
                $(".tishi").html("×").css("color", "red")
                $flag = false;
            }

        })
    })

    $("form").on("submit", function () {
        if ($user.val() == "") {
            $(".tishi").html("用户名不能为空").css("color", "red")
            $flag = false;
        }
        if (!$flag) {
            return false;
        }
    })
})(jQuery);