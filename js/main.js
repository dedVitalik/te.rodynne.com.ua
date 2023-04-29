"use strict";

document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  // setTimeout(function () {
  //   document.body.classList.remove("preload");
  // }, 500);

  var windowHeight = window.innerHeight,
    windowHeightExtra = 0;
  var safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    mobile = /Mobi/.test(navigator.userAgent); // check if safari - extend height

  if (safari && !mobile) {
    windowHeightExtra = window.outerHeight - window.innerHeight;
  }

  if (mobile) {
    windowHeight = window.screen.availHeight; // stops from jumping

    windowHeightExtra = (window.screen.availHeight - window.innerHeight) / 2; // prevents white spaces
  } // position parallax

  var positionParallax = function positionParallax(container, speed, parallax, elem) {
    var bgScroll = container.top / speed - windowHeightExtra;
    parallax[elem].style.top = bgScroll + "px";
  }; // animate parallax

  var animateParallax = function animateParallax(parallax, speed) {
    for (var i = 0; parallax.length > i; i++) {
      var container = parallax[i].parentElement.parentElement.getBoundingClientRect(); // only animate if on screen

      if (container.top + container.height >= 0 && container.top <= windowHeight) {
        positionParallax(container, speed, parallax, i);
      }
    }
  }; // determine height
  
  //

        var ruPath = '/ru';

        var btnRu = document.getElementById('btnRu');
        var btnUa = document.getElementById('btnUa');

        var currentURL = window.location.protocol + "//" + window.location.host;
        var newPath = window.location.pathname.replace(ruPath, '').replace('//', '');
		if (newPath.length < 2) {
			newPath = '';
		}

        btnRu.addEventListener('click', function () {
            window.location.href = currentURL + ruPath + newPath;
        }, true);

        btnUa.addEventListener('click', function () {
            window.location.href = currentURL + newPath;
        }, true);
//

  var calculateHeight = function calculateHeight(parallax, speed) {
    for (var i = 0; parallax.length > i; i++) {
      var container = parallax[i].parentElement.parentElement.getBoundingClientRect();
      var containerTop = parallax[i].parentElement.parentElement.offsetTop;
      var elemOffsetTop = (windowHeight - container.height) / 2; // set bgHeight & check if it needs to stretch beyond container bottom

      var bgHeight =
        windowHeight > container.height + containerTop
          ? container.height + containerTop - containerTop / speed
          : container.height + (elemOffsetTop - elemOffsetTop / speed) * 2;
      parallax[i].style.height = bgHeight + windowHeightExtra * 2 + "px";
      positionParallax(container, speed, parallax, i);
    }
  };

  var universalParallax = function universalParallax() {
    var up = function up(parallax, speed) {
      // check that speed is not a negative number
      if (speed < 1) {
        speed = 1;
      } // set height on elements

      calculateHeight(parallax, speed); // recalculate height on resize

      if (!mobile) {
        window.addEventListener("resize", function () {
          windowHeight = window.innerHeight;
          calculateHeight(parallax, speed);
        });
      } // Add scroll event listener

      window.addEventListener("scroll", function () {
        animateParallax(parallax, speed);
      });
    }; // Ready all elements

    this.init = function (param) {
      if (typeof param === "undefined") {
        param = {};
      }

      param = {
        speed: typeof param.speed !== "undefined" ? param.speed : 1.5,
        className: typeof param.className !== "undefined" ? param.className : "parallax",
      };
      var parallax = document.getElementsByClassName(param.className);

      for (var i = 0; parallax.length > i; i++) {
        // make container div
        var wrapper = document.createElement("div");
        parallax[i].parentNode.insertBefore(wrapper, parallax[i]);
        wrapper.appendChild(parallax[i]);
        var parallaxContainer = parallax[i].parentElement;
        parallaxContainer.className += "parallax__container"; // parent elem need position: relative for effect to work - if not already defined, add it

        if (
          window.getComputedStyle(parallaxContainer.parentElement, null).getPropertyValue("position") !== "relative"
        ) {
          parallaxContainer.parentElement.style.position = "relative";
        }

        var imgData = parallax[i].dataset.parallaxImage; // add image to div if none is specified

        if (typeof imgData !== "undefined") {
          parallax[i].style.backgroundImage = "url(" + imgData + ")"; // if no other class than .parallax is specified, add CSS

          if (parallax[i].classList.length === 1 && parallax[i].classList[0] === "parallax") {
            parallax[i].style.backgroundRepeat = "no-repeat";
            parallax[i].style.backgroundPosition = "center";
            parallax[i].style.backgroundSize = "cover";
          }
        }
      } // when page is loaded && init completed -> run function

      document.addEventListener("readystatechange", function (event) {
        if (event.target.readyState === "complete") {
          up(parallax, param.speed);
        }
      });
    };
  };

  function userSwiped() {
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    var yDown = null;
    var xDown = null;

    function getTouches(evt) {
      return evt.touches || evt.originalEvent.touches;
    }

    function handleTouchStart(evt) {
      var firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    }

    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          if (document.body.classList.contains("_menu")) closeMenu();
          if (document.body.classList.contains("_socials")) headerSocialsClose();
        }
      }

      xDown = null;
      yDown = null;
    }
  }

  userSwiped();

  function getPosition(element) {
    var x = 0;
    var y = 0;

    while (element) {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    }

    return {
      x: x,
      y: y,
    };
  }
  new universalParallax().init({
    speed: 4.0,
  });

  function openMenu() {
    if (document.body.classList.contains("_socials")) headerSocialsClose();
    document.querySelector(".menu-icon").classList.add("_active");
    document.querySelector(".menu__list").classList.add("_active");
    document.body.classList.add("_menu");
  }

  function closeMenu() {
    document.querySelector(".menu-icon").classList.remove("_active");
    document.querySelector(".menu__list").classList.remove("_active");
    document.body.classList.remove("_menu");
  }

  document.querySelector(".menu-icon").addEventListener("click", function () {
    if (document.body.classList.contains("_menu")) closeMenu();
    else openMenu();
  });

  function headerSocialsOpen() {
    var socials = document.querySelector(".social");
    var body = socials.querySelector(".social__body");
    if (document.body.classList.contains("_menu")) closeMenu();
    body.classList.add("_active");
    document.body.classList.add("_socials");
  }

  function headerSocialsClose() {
    var socials = document.querySelector(".social");
    var body = socials.querySelector(".social__body");
    if (document.body.classList.contains("_menu")) closeMenu();
    body.classList.remove("_active");
    document.body.classList.remove("_socials");
  }

  document.querySelector(".header .social__img").addEventListener("click", function () {
    if (document.body.classList.contains("_socials")) headerSocialsClose();
    else headerSocialsOpen();
  });
  var headerSelect = document.querySelector("header .city");

  function headerSelectOpen() {
    headerSelect.classList.add("_active");
    var list = headerSelect.querySelector("ul");
    list.style.maxHeight = list.scrollHeight + "px";
  }

  function headerSelectClose() {
    headerSelect.classList.remove("_active");
    var list = headerSelect.querySelector("ul");
    list.style.maxHeight = "";
  }

  function headerSelectInitialOption() {
    var activeItem = headerSelect.querySelector("a._active");
    var currentText = headerSelect.querySelector("span");
    if (activeItem && currentText) currentText.textContent = activeItem.textContent;
  }

  headerSelectInitialOption();
  headerSelect.addEventListener("click", function (evt) {
    if (headerSelect.classList.contains("_active")) headerSelectClose();
    else headerSelectOpen();
  });
  window.addEventListener("click", function (evt) {
    if (headerSelect.classList.contains("_active") && !headerSelect.contains(evt.target)) {
      headerSelectClose();
    }
  });
});
