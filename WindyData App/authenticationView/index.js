'use strict';

app.authenticationView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var provider = app.data.defaultProvider,
        mode = 'signin',
        registerRedirect = 'home',
        signinRedirect = 'home',
        init = function() {
            var activeView = mode === 'signin' ? '.signin-view' : '.signup-view';

            if (provider.setup && provider.setup.offlineStorage && !app.isOnline()) {
                $('.offline').show().siblings().hide();
            } else {
                $(activeView).show().siblings().hide();
            }
        },
        successHandler = function(data) {
            var redirect = mode === 'signin' ? signinRedirect : registerRedirect;

            if (data && data.result) {
                app.user = data.result;
                app.mobileApp.navigate(redirect + '/view.html');
            } else {
                init();
            }
        },
        authenticationViewModel = kendo.observable({
            displayName: '',
            email: '',
            password: '',
            signin: function() {
                var email = authenticationViewModel.email.toLowerCase(),
                    password = authenticationViewModel.password;

                provider.Users.login(email, password, successHandler, init);
            },
            register: function() {
                var email = authenticationViewModel.email.toLowerCase(),
                    password = authenticationViewModel.password,
                    displayName = authenticationViewModel.displayName,
                    attrs = {
                        Email: email,
                        DisplayName: displayName
                    };

                provider.Users.register(email, password, attrs, successHandler, init);
            },
            actionSheet: function(){
                var options = {
                    'androidTheme' : window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
                    'title': 'What do you want with this image?',
                    'buttonLabels': ['Share via Facebook', 'Share via Twitter'],
                    'androidEnableCancelButton' : true,
                    'winphoneEnableCancelButton' : true,
                    'addCancelButtonWithLabel': 'Cancel',
                    'addDestructiveButtonWithLabel' : 'Delete it',
                    'position': [20, 40] // for iPad pass in the [x, y] position of the popover
                  };

                  // Depending on the buttonIndex, you can now call f.i. shareViaFacebook or shareViaTwitter
                  // of the SocialSharing plugin (http://plugins.telerik.com/plugin/socialsharing)
                  window.plugins.actionsheet.show(options, function(index){ alert('Index: '+ index)});
            },
            toggleView: function() {
                mode = mode === 'signin' ? 'register' : 'signin';
                init();
            }
        });

    parent.set('authenticationViewModel', authenticationViewModel);
    parent.set('onShow', function() {
        provider.Users.currentUser().then(successHandler, init);
    });
})(app.authenticationView);