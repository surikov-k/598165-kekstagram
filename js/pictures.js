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

var posts = [];

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

var generateThumbsData = function () {
  for (var i = 0; i < MAX_THUMBS; i++) {
    posts[i] = {};
    posts[i].url = 'photos/' + (i + 1) + '.jpg';
    posts[i].likes = getRandomInt(MIN_LIKES, MAX_LIKES);
    posts[i].comments = getComments();
    posts[i].description = getDescription();
  }
};

generateThumbsData();

var createThumbsElements = function () {
  var pictureLinkTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < posts.length; i++) {
    var pictureLink = pictureLinkTemplate.cloneNode(true);
    pictureLink.querySelector('.picture__img').src = posts[i].url;
    pictureLink.querySelector('.picture__stat--likes').textContent = posts[i].likes;
    pictureLink.querySelector('.picture__stat--comments').textContent = posts[i].comments.length;
    fragment.appendChild(pictureLink);
  }

  var pictures = document.querySelector('.pictures');
  pictures.appendChild(fragment);
};

createThumbsElements();

var bigPicture = document.querySelector('.big-picture');

var createBigPictureElements = function (postId) {
  bigPicture.querySelector('.big-picture__img img').src = posts[postId].url;
  bigPicture.querySelector('.likes-count').textContent = posts[postId].likes;
  bigPicture.querySelector('.comments-count').textContent = posts[postId].comments.length;

  var commentsFragment = document.createDocumentFragment();
  var socialCommentTemplate = bigPicture.querySelector('.social__comment');

  var socialCommentsList = bigPicture.querySelector('.social__comments');
  while (socialCommentsList.firstChild) {
    socialCommentsList.removeChild(socialCommentsList.firstChild);
  }

  for (var i = 0; i < posts[postId].comments.length; i++) {
    var socialComment = socialCommentTemplate.cloneNode(true);
    socialComment.classList.add('social__comment--text');
    socialComment.querySelector('.social__picture').src = 'img/avatar-' + getRandomInt(1, 6) + '.svg';
    socialComment.querySelector('.social__text').textContent = posts[postId].comments[i];

    commentsFragment.appendChild(socialComment);
  }
  bigPicture.querySelector('.social__caption').textContent = posts[postId].description;
  bigPicture.querySelector('.social__comments').appendChild(commentsFragment);
};

bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');

createBigPictureElements(1);
bigPicture.classList.remove('hidden');
