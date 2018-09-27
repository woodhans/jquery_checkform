(function($, window, document) {
  var formCheckObj = function() {
    return {
      init: function(options, el, callback) {
        var base = this;
        base.$opt = options;
        base.$elem = el;
        base.$call = callback;
        base._setup()
      },
      _setup: function() {
        var base = this;
        $checks = base.$opt.checkInputs;
        $submit = base.$elem.find("[type='submit'],[data-check-button]");
        $checks.each(function(i, e) {
          $(e).on('focus', function() {
            base.clearMsg($(e));
          }).on('blur', function() {
            base.checkInput($(e))
          })
        });
        $submit.each(function(i, e) {
          $(e).on('click', function() {
            return base.submitForm($(e).parents('form'));
          })
        })
      },
      clearMsg: function(ele) {
        ele.removeClass("error").removeClass("checked").addClass("checking").siblings(".errormsg").remove();
      },
      checkInput: function(ele) {
        var base = this;
        base.clearMsg(ele);
        _err = !1;
        checksObj = ele.data("validate");
        
        if (checksObj == "" || typeof(checksObj)!="object") checksObj = {"require":true};
        for (var key in checksObj) {
          if (!base.checkItem(ele, key,checksObj[key].toString())) {
            base.showMsg(ele, key, checksObj[key].toString());
            _err = !0;
            break;
          }
        }
        if (!_err)
          ele.addClass("checked").removeClass("error").removeClass("checking").data("checked", 1);
        
      },
      checkItem: function(ele, key, val) {
        _val = val.split("###")[0];
        
        if (key == "require")
          return trim(ele.val()) != "";
        if (key == "username")
          return ele.val()!=""?checkUsername(ele.val()):true;      
        if (key == "password")
          return ele.val()!=""?checkPassword(ele.val()):true;
        if (key == "email")
          return ele.val()!=""?checkEmail(ele.val()):true;
        if (key == "telephone")
          return ele.val()!=""?checkTelephone(ele.val()):true;
        if (key == "url")
          return ele.val()!=""?checkUrl(ele.val()):true;
        if (key == "regex")
          return ele.val()!=""?checkRegex(ele.val(), _val):true;
        if (key == "min")
          return ele.val().length >= _val;
        if (key == "max")
          return ele.val().length <= _val;
        if (key == "ajax") {
          res=false;
          $.ajax({
            url: _val,
            async:false,
            data:{"v":ele.val()},
            success: function(d) {
              res=d=="true"?true:false;
            }
          })
          return res;
        }
        if (key == "equal")
          return ele.val() == $("#" + _val).val();
        
        
      },
      showMsg:function(ele, key, val){
        var base = this;
        ele.removeClass("checked").addClass("error").data("checked", 0);
        _msg=val.split("###")[1];
        _val = val.split("###")[0];
        if (key == "require")
          ele.parent().append("<span class='errormsg'>"+(_msg||"该项为必填项")+"</span>");
        if (key == "username")
          ele.parent().append("<span class='errormsg'>"+(_msg||"账号格式不正确")+"</span>");
        if (key == "email")
          ele.parent().append("<span class='errormsg'>"+(_msg||"邮箱格式不正确")+"</span>");
        if (key == "password")
          ele.parent().append("<span class='errormsg'>"+(_msg||"密码格式不正确")+"</span>");
        if (key == "telephone")
          ele.parent().append("<span class='errormsg'>"+(_msg||"手机号格式不正确")+"</span>");
        if (key == "url")
          ele.parent().append("<span class='errormsg'>"+(_msg||"网址格式不正确")+"</span>");
        if (key == "regex")
          ele.parent().append("<span class='errormsg'>"+(_msg||"验证错误")+"</span>");
        if (key == "min")
          ele.parent().append("<span class='errormsg'>"+(_msg||"长度不能少于"+_val+"位")+"</span>");
        if (key == "max")
          ele.parent().append("<span class='errormsg'>"+(_msg||"长度不能大于"+_val+"位")+"</span>");
        if (key == "equal")
          ele.parent().append("<span class='errormsg'>"+(_msg||"该项要与"+_val+"项相同")+"</span>");
        if (key == "ajax")
          ele.parent().append("<span class='errormsg'>"+(_msg||"验证错误")+"</span>");
      },
      submitForm: function(form) {
        var base = this;
        $checks = base.$opt.checkInputs;
        _err=!0;
        for (i = 0; i < $checks.length; i++) {
          if ($checks.eq(i).data("checked") == undefined || $checks.eq(i).data("checked") != "1") {
            base.checkInput($checks.eq(i));
            _err=!1;
          }
        }

        if(_err)
        return base.$call();
      },
    }
  };
  $.fn.formCheck = function(callback) {
    options = $.extend({
      checkInputs: this.find('[data-validate]')
    });
    var fc = new formCheckObj();
    fc.init(options, this, callback);
  };

  function trim(v) {
    return v.replace(/(^\s*)|(\s*$)/g, "");
  }
  function checkUsername(v){
    return /^[a-zA-Z]{1}[0-9a-zA-Z_]{0,14}[0-9a-zA-Z]{1}$/.test(v);
  }
  function checkPassword(v){
    return /^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/.test(v);//(?=.*[!@#$%^&*?])
  }
  function checkEmail(v) {
    return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(v);
  }

  function checkRegex(v, reg) {
    return new RegExp(reg).test(v);
  }

  function checkTelephone(v) {
    return /^1[0-9]{10}$/.test(v);
  }

  function checkUrl(v) {
    return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(v);
  }
}(jQuery, window, document))