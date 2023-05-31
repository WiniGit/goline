function createCarouselHTML(item, data) {
    item.value = createCarousel(item, data);
}

function createCarousel(item, listChild) {
    let carousel = item.value?.id ? item.value : document.createElement("div");
    $(carousel).addClass("w-carousel");
    if(item.JsonItem.AutoPlay) $(carousel).addClass("autoplay");
    carousel.setAttribute("effect", item.JsonItem.Effect);
    carousel.setAttribute("transition-ms", item.JsonItem.TransitionTime);
    carousel.setAttribute("transform-ms", item.JsonItem.TransformTime);
    carousel.setAttribute("effect", item.JsonItem.Effect);
    carousel.style.setProperty("--action-size", `${item.JsonItem.ActionSize}px`);
    carousel.style.setProperty("--action-color", `#${item.JsonItem.ActionColor.substring(2)}${item.JsonItem.ActionColor.substring(0, 2)}`);
    carousel.style.setProperty("--action-bg", `#${item.JsonItem.ActionBackground.substring(2)}${item.JsonItem.ActionBackground.substring(0, 2)}`);
    //
    let slideList = document.createElement("div");
    $(slideList).addClass("slide-list");
    let slideTrack = document.createElement("div");
    if (!item.build) {
        if (item.CarouselData.initSlide >= item.CarouselData.slides.length) item.CarouselData.initSlide = 0;
        if (item.JsonItem.Effect === WCarouselEffect.easeInOut) {
            slideTrack.style.transform = `translateX(calc(-100% * ${item.CarouselData.initSlide}))`;
        }
    }
    $(slideTrack).addClass("slide-track");
    slideList.appendChild(slideTrack);
    let slideNumber = item.JsonItem.Effect === WCarouselEffect.easeInOut ? item.CarouselData.slides.length : item.CarouselData.slides.length - 1;
    for (let i = 0; i <= slideNumber; i++) {
        let caroItem = item.CarouselData.slides[i] ?? item.CarouselData.slides[0];
        let slide = document.createElement("div");
        $(slide).addClass("slide-clone");
        $(slide).attr("data-index", i);
        if (i === item.CarouselData.initSlide) {
            $(slide).addClass("children-value");
            slide.replaceChildren(...listChild.map(child => child.value));
            slide.setAttribute("isactive", "true");
        } else {
            slide.replaceChildren(...listChild.map(child => child.value.cloneNode(true)));
        }
        if (caroItem.background) {
            if (caroItem.background.match(hexRegex)) {
                slide.style.backgroundColor = `#${caroItem.background.substring(2)}${caroItem.background.substring(0, 2)}`;
            } else {
                slide.style.backgroundImage = `url(${caroItem.background})`;
            }
        }
        for (const property in caroItem) {
            let listDataTag = slide.querySelectorAll(`.wbaseItem-value[name-field="${property}"]`);
            listDataTag.forEach(eHTML => {
                let fakeItem = JSON.parse(JSON.stringify(listChild.find(e => e.GID === eHTML.id || e.AttributesItem.NameField === property)));
                fakeItem.AttributesItem.Content = `${caroItem[property]}`;
                fakeItem.value = eHTML;
                updateComponentContent(fakeItem);
            });
        }
        if (i !== item.CarouselData.initSlide) {
            slide.querySelectorAll(".wbaseItem-value").forEach(e => {
                $(e).removeAttr('id');
                $(e).removeClass("wbaseItem-value");
            });
        }
        slideTrack.appendChild(slide);
    }
    //
    let btnBack = document.createElement("i");
    let btnNext = document.createElement("i");
    if (item.JsonItem.ActionType === "caret") {
        btnBack.className = "fa-solid fa-caret-left slide-prev slide-arrow";
        btnNext.className = "fa-solid fa-caret-right slide-next slide-arrow";
    } else {
        btnBack.className = "fa-solid fa-chevron-left slide-prev slide-arrow";
        btnNext.className = "fa-solid fa-chevron-right slide-next slide-arrow";
    }
    carousel.replaceChildren(slideList, btnBack, btnNext);
    return carousel;
}

function playCarousel(carousel) {
    let slideTrack = carousel.querySelector(".slide-track");
    let slides = carousel.querySelectorAll(".slide-clone");
    let count = [...slides].find(slide => slide.getAttribute("isactive") === "true").getAttribute("data-index");
    count = parseInt(count) + 1;
    let transitionTime = parseInt(carousel.getAttribute("transition-ms"));
    let transformTime = parseInt(carousel.getAttribute("transform-ms"));
    let isFade = carousel.getAttribute("effect") === WCarouselEffect.fade;
    carousel.playInterval = setInterval(() => {
        if (isFade) {
            $(slides[count - 1]).fadeOut(transformTime);
            slides[count - 1].removeAttribute("isactive");
            count++;
            if (count === slides.length + 1) {
                $(slides[0]).fadeIn(transformTime);
                slides[0].setAttribute("isactive", "true");
                count = 1;
            } else {
                $(slides[count - 1]).fadeIn(transformTime);
                slides[count - 1].setAttribute("isactive", "true");
            }
        } else {
            slides[count - 1].removeAttribute("isactive");
            slideTrack.style.transition = `transform ${transformTime}ms ease-in-out`;
            slideTrack.style.transform = `translateX(calc(-100% * ${count}))`;
            count++;
            if (count === slides.length) {
                slides[0].setAttribute("isactive", "true");
                count = 1;
                setTimeout(function () {
                    slideTrack.style.transition = `none`;
                    slideTrack.style.transform = `translateX(0px)`;
                }, transformTime + 100);
            } else {
                slides[count - 1].setAttribute("isactive", "true");
            }
        }
    }, transitionTime);
}

function stopCarousel(carousel) {
    clearInterval(carousel.playInterval);
    carousel.playInterval = null;
    createCarousel(wbase_list.find(e => e.GID === carousel.id), wbase_list.filter(e => e.ParentID === carousel.id));
}