$(document).ready(function () {
    $('#slack-form').submit(function (e) {
        e.preventDefault();
        var btn = $('.chat-submit-slack', this),
            email = $('.chat-email-input', this),
            formMessage = $('.chat-slack-form-message', this);

        console.log(email.val());
        if (!email.val()) {
            return;
        }

        btn.prop('disabled', true);
        $.ajax({
            type: 'POST',
            url: 'https://couchdb-slack.now.sh/invite',
            dataType: 'json',
            crossDomain: true,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({ email: email.val() })
        })
        .fail(function (res) {
            console.log('res', res);
            var err;
            try {
              err = JSON.parse(res.responseText);
            } catch (e) {
              console.log('err', e);
            }

            if (!err) {
              return formMessage.removeClass('slack-message').addClass('slack-message-fail')
                  .html('Sorry, there was a server error. Please try our <a href="https://couchdb-slack.now.sh">Backup invite form</a>');
            }
            if (/already been invited/.test(err.msg)) {
                return formMessage.removeClass('slack-message').addClass('slack-message-fail')
                    .text('It looks like you\'ve already joined!');
            }

            formMessage.removeClass('slack-message').addClass('slack-message-fail')
                .text(err.msg);
        })
        .done(function (data) {
            email.val('');
            formMessage.removeClass('slack-message')
                .addClass('slack-message-done')
                .text('Woot! Check your email!');
        })
        .always(function () {
            btn.prop('disabled', false);
        });
    });
});
