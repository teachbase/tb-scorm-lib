# tb-scorm-lib
SCORM interaction library
Player + API


Run dev server
```
cd server
npm install
npm run server
```
And open http://localhost:8081

В консоли ты сможешь увидеть какие запросы отправляет SCORM на backend и что SCORM может запрашивать.

В папке `client`

Cтавим зависимтости 
```
yarn
```
сам код библиотеки и в `client/dist/scorm-rte.min.js` она собирается

Так же там есть подготовленная для дебага статика, сервер(:8081) уже на нее настроен
Имеются 3 скорма для примеров в resources
подключаются они вторым параметром в `scormRTE.init`

Пример
```js
window.onload = function() {
  console.log(scormRTE)
  scormRTE.init('scorm_player', 'http://localhost:8081/resources/beerHistory',
  {
    dataUrl : 'http://localhost:8081/api/scorm/results',
    debug: true,
    initModel: {
      learnerId: 50,
      learnerName: 'Bublik',
    }
  });
};
```

Для теста друго скорма достаточно положить его в resources и поменять ссылку в `index.html`

Собрать новую версию
```
npm run compile
```
Еще в проекте настроен [gulp](https://gulpjs.com/docs/en/getting-started/quick-start) аналог рубишного guard
Можно его поставить и включить:
```
npm install --global gulp-cli
gulp watch
```
тогда он будет следить за файлами и собирать `/dist/scorm-rte.min.js` 
