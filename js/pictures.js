'use strict';

var MAX_THUMBS = 25;

var MIN_LIKES = 15;
var MAX_LIKES = 200;

var COMMENT_SAMPLES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент ?!'
];

var DESCRIPTION_SAMPLES = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье.Цените тех, кто рядом с вами и отгоняйте все сомненья.Не обижайте всех словами......',
  'Вот это тачка!'
];

var MAX_COMMENTS = 6;
var ESC_KEYCODE = 27;
var DEFAULT_SCALE = 100;
var SCALE_MAX = 100;
var SCALE_MIN = 25;
var SCALE_STEP = 25;

var pictureLinks = [];

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getComments = function () {
  var comments = [];
  var commentsCount = getRandomInt(1, MAX_COMMENTS);
  var twoSentences = getRandomInt(0, 1);

  for (var i = 0; i < commentsCount; i++) {
    var firstSentenceIndex = getRandomInt(0, COMMENT_SAMPLES.length - 1);
    comments[i] = COMMENT_SAMPLES[firstSentenceIndex];
    if (twoSentences) {
      do {
        var secondSentenceIndex = getRandomInt(0, COMMENT_SAMPLES.length - 1);
      } while (secondSentenceIndex === firstSentenceIndex);

      comments[i] += ' ' + COMMENT_SAMPLES[secondSentenceIndex];
    }
  }

  return comments;
};

var getDescription = function () {
  return DESCRIPTION_SAMPLES[getRandomInt(0, DESCRIPTION_SAMPLES.length - 1)];
};

var generatePictureLinkData = function () {
  for (var i = 0; i < MAX_THUMBS; i++) {
    pictureLinks[i] = {};
    pictureLinks[i].url = 'photos/' + (i + 1) + '.jpg';
    pictureLinks[i].likes = getRandomInt(MIN_LIKES, MAX_LIKES);
    pictureLinks[i].comments = getComments();
    pictureLinks[i].description = getDescription();
  }
};

generatePictureLinkData();

var createPictureLinkElements = function () {
  var pictureLinkTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictureLinks.length; i++) {
    var pictureLink = pictureLinkTemplate.cloneNode(true);
    pictureLink.querySelector('.picture__img').src = pictureLinks[i].url;
    pictureLink.querySelector('.picture__stat--likes').textContent = pictureLinks[i].likes;
    pictureLink.querySelector('.picture__stat--comments').textContent = pictureLinks[i].comments.length;
    pictureLink.setAttribute('data-picture-id', i);
    fragment.appendChild(pictureLink);
  }

  var pictures = document.querySelector('.pictures');
  pictures.appendChild(fragment);
};

createPictureLinkElements();

var bigPictureOverlay = document.querySelector('.big-picture');

var createBigPictureElements = function (id) {
  bigPictureOverlay.querySelector('.big-picture__img img').src = pictureLinks[id].url;
  bigPictureOverlay.querySelector('.likes-count').textContent = pictureLinks[id].likes;
  bigPictureOverlay.querySelector('.comments-count').textContent = pictureLinks[id].comments.length;

  var commentsFragment = document.createDocumentFragment();
  var socialCommentTemplate = bigPictureOverlay.querySelector('.social__comment');

  var socialCommentsList = bigPictureOverlay.querySelector('.social__comments');
  while (socialCommentsList.firstChild) {
    socialCommentsList.removeChild(socialCommentsList.firstChild);
  }

  for (var i = 0; i < pictureLinks[id].comments.length; i++) {
    var socialComment = socialCommentTemplate.cloneNode(true);
    socialComment.classList.add('social__comment--text');
    socialComment.querySelector('.social__picture').src = 'img/avatar-' + getRandomInt(1, 6) + '.svg';
    socialComment.querySelector('.social__text').textContent = pictureLinks[id].comments[i];

    commentsFragment.appendChild(socialComment);
  }
  bigPictureOverlay.querySelector('.social__caption').textContent = pictureLinks[id].description;
  bigPictureOverlay.querySelector('.social__comments').appendChild(commentsFragment);
};

var renderBigPictureOverlay = function () {
  bigPictureOverlay.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPictureOverlay.querySelector('.social__loadmore').classList.add('visually-hidden');

  bigPictureOverlay.classList.remove('hidden');
  var bigPictureCancelButton = document.querySelector('.big-picture__cancel');

  var closeBigPictureOverlay = function () {
    bigPictureOverlay.classList.add('hidden');
    document.removeEventListener('keydown', escKeyKeydownHandler);
  };
  var escKeyKeydownHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPictureOverlay();
    }
  };

  bigPictureCancelButton.addEventListener('click', function () {
    closeBigPictureOverlay();
  });

  document.addEventListener('keydown', escKeyKeydownHandler);
};


var picturesContainer = document.querySelector('.pictures');
var uploadFileField = document.querySelector('.img-upload__input');
var imageUploadOverlay = document.querySelector('.img-upload__overlay');
var uploadCancelButton = document.querySelector('.img-upload__cancel');

var imgUploadResize = document.querySelector('.img-upload__resize');
var resizeControlValue = document.querySelector('.resize__control--value');
var imgUploadPreview = document.querySelector('.img-upload__preview').querySelector('img');
var scaleValue = document.querySelector('.scale__value');
var scalePin = document.querySelector('.scale__pin');
var imgUploadScale = document.querySelector('.img-upload__scale');
var effectsList = document.querySelector('.effects__list');

var currentEffect;
var currentScale = DEFAULT_SCALE;

var initImageUploadOverlay = function () {
  imgUploadScale.classList.add('hidden');
  currentScale = DEFAULT_SCALE;
  resizeControlValue.value = DEFAULT_SCALE + '%';
  imgUploadPreview.className = '';
  imgUploadPreview.style = '';
  imgUploadPreview.style.transform = 'scale(' + DEFAULT_SCALE * 0.01 + ')';
};

var escPressHandler = function (evt) {

  var target = document.activeElement.name;
  if (evt.keyCode === ESC_KEYCODE) {
    if (target !== 'hashtags' && target !== 'description') {
      closeImageUploadOverlay();
    }
  }
};

var closeImageUploadOverlay = function () {
  imageUploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', escPressHandler);
  uploadFileField.value = '';
};

var openImageUploadOverlay = function () {
  imageUploadOverlay.classList.remove('hidden');
  uploadCancelButton.addEventListener('click', function () {
    closeImageUploadOverlay();
  });
  document.addEventListener('keydown', escPressHandler);
  initImageUploadOverlay();
};

uploadFileField.addEventListener('change', function () {
  openImageUploadOverlay();
});


var applyEffect = function (effect) {
  imgUploadPreview.className = '';
  imgUploadPreview.style = '';
  imgUploadPreview.className = 'effects__preview--' + effect;
  imgUploadPreview.style.transform = 'scale(' + currentScale * 0.01 + ')';
  currentEffect = effect;
  if (effect !== 'none') {
    imgUploadScale.classList.remove('hidden');
  } else {
    imgUploadScale.classList.add('hidden');
  }
};

var effectsListClickHandler = function (evt) {
  if (evt.target.matches('.effects__radio')) {
    var effectName = evt.target.id.substr(7);
    applyEffect(effectName);
  }
};

var changeEffectValue = function (effect, effectValue) {
  switch (effect) {
    case 'chrome':
      imgUploadPreview.style.filter = 'grayscale(' + effectValue / 100 + ')';
      break;
    case 'sepia':
      imgUploadPreview.style.filter = 'sepia(' + effectValue / 100 + ')';
      break;
    case 'marvin':
      imgUploadPreview.style.filter = 'invert(' + effectValue + '%)';
      break;
    case 'phobos':
      imgUploadPreview.style.filter = 'blur(' + effectValue * 0.03 + 'px)';
      break;
    case 'heat':
      imgUploadPreview.style.filter = 'brightness(' + effectValue * 0.03 + ')';
      break;
  }
};


var scalePinMouseupHandler = function (evt) {
  var pinX = evt.target.offsetLeft;
  var scaleLineWidth = evt.target.parentElement.offsetWidth;
  var scalePinValue = Math.round(pinX / scaleLineWidth * 100);
  scaleValue.value = scalePinValue;
  changeEffectValue(currentEffect, scaleValue.value);

};

var imgUploadResizeHandler = function (evt) {
  if (evt.target.matches('.resize__control--minus')) {
    currentScale -= SCALE_STEP;
    if (currentScale < SCALE_MIN) {
      currentScale = SCALE_MIN;
    }
    resizeControlValue.value = currentScale + '%';
    imgUploadPreview.style.transform = 'scale(' + currentScale * 0.01 + ')';
  } else if (evt.target.matches('.resize__control--plus')) {
    currentScale += SCALE_STEP;
    if (currentScale > SCALE_MAX) {
      currentScale = SCALE_MAX;
    }
    resizeControlValue.value = currentScale + '%';
    imgUploadPreview.style.transform = 'scale(' + currentScale * 0.01 + ')';
  }
};


var pictureLinkClickHandler = function (evt) {
  if (evt.target.matches('.picture__img')) {
    var bigPictureId = evt.target.parentElement.getAttribute('data-picture-id');
    createBigPictureElements(bigPictureId);
    renderBigPictureOverlay();
  }
};

imgUploadResize.addEventListener('click', imgUploadResizeHandler);
effectsList.addEventListener('click', effectsListClickHandler);
scalePin.addEventListener('mouseup', scalePinMouseupHandler);
picturesContainer.addEventListener('click', pictureLinkClickHandler);
