class EnumAnimation {
    static Instant = 1;
    static Dissolve = 2;
    static MoveIn = 3;
    static MoveOut = 4;
    static Push = 5;
    static SlideIn = 6;
    static SlideOut = 7;

    static get_animationName(animation) {
        switch (animation) {
            case 1:
                return "Instant"
            case 2:
                return "Dissolve"
            case 3:
                return "Move In"
            case 4:
                return "Move Out"
            case 5:
                return "Push"
            case 6:
                return "Slide In"
            case 7:
                return "Slide Out"
            default:
                return "Instant"
        }
    }
}
class EnumTiming {
    static Linear = 1;
    static Ease = 2;

    static get_timingName(animation) {
        switch (animation) {
            case 1:
                return "Linear"
            case 2:
                return "Ease"
            default:
                return "Linear"
        }
    }
}

// Animation
// Direction
// Timing
// Duration

$('body').on("click", ".select-animation-container", function (ev) {
    ev.stopPropagation();
    $('.select-animation-popup').css({
        // top: $(this).offset().top - $('.setting-interaction-popup').offset().top + 32,
        display: 'flex',
    });
});

$('body').on("click", ".select-animation-container .animation-option", function (ev) {
    ev.stopPropagation();
    let animation_item = selected_list[0].JsonEventItem.find(e => e.Name == "Animation");
    animation_item.Data.Animation = $(this).data('enum');
    WBaseDA.edit(selected_list, EnumObj.attribute);
    $(".selected-animation").text(EnumAnimation.get_animationName($(this).data('enum')));
    $('.animation_popup').hide();
});

$('body').on("click", ".select-direction-container .direction-option", function (ev) {
    ev.stopPropagation();
    $('.direction-option').removeClass("selected");
    $(this).addClass("selected");
    let animation_item = selected_list[0].JsonEventItem.find(e => e.Name == "Animation");
    animation_item.Data.Direction = $(this).data('direction');
    WBaseDA.edit(selected_list, EnumObj.attribute);
    // TODO: update data
});

$('body').on("click", ".select-timing-container", function (ev) {
    ev.stopPropagation();
    $('.select-timing-popup').css({
        // top: $(this).offset().top - $('.setting-interaction-popup').offset().top + 32,
        display: 'flex',
    });
});
$('body').on("click", ".select-timing-container .timing-option", function (ev) {
    ev.stopPropagation();
    // TODO: update data
    let animation_item = selected_list[0].JsonEventItem.find(e => e.Name == "Animation");
    animation_item.Data.Timing = $(this).data('enum');
    WBaseDA.edit(selected_list, EnumObj.attribute);
    $(".selected-timing").text(EnumTiming.get_timingName($(this).data('enum')));
    $('.animation_popup').hide();
});

$('body').on("blur", '.animate-time', function (ev) {
    // TODO: update data
    let animation_item = selected_list[0].JsonEventItem.find(e => e.Name == "Animation");
    if ($(this).val() != animation_item.Data.Duration) {
        animation_item.Data.Duration = $(this).val();
        WBaseDA.edit(selected_list, EnumObj.attribute);
    }
});


$('body').on("click", function (ev) {
    if (!$('.animation_popup').is(ev.target)) {
        $('.animation_popup').hide();
    }
});

// var list = wbase_list.filter(e => e.PrototypeID);
// list.forEach(e => {
//     e.JsonEventItem.push({ Name: "Animation", Data: {} });
// });

// WBaseDA.edit(list, EnumObj.attribute)
// let animation_item = selected_list[0].JsonEventItem.find(e => e.Name == "Animation");
