
$(document).ready(()=>{


/////////////////// отправка формы //////////////////////// 
$("#photoForm").on('submit',(function(e) {
    e.preventDefault(); // делаем отмену действия браузера и формируем ajax
    var formData = new FormData($('#photoForm')[0]);
    // данные с формы завернем в переменную для ajax

    $.ajax({
        type:'POST', // тип запроса
        url: $(this).attr('action'), // куда будем отправлять, можно явно указать
        data:formData, // данные, которые передаем
        cache:false, // кэш и прочие настройки писать именно так (для файлов)
        // (связано это с кодировкой и всякой лабудой)
        contentType: false, // нужно указать тип контента false для картинки(файла)
        processData: false, // для передачи картинки(файла) нужно false 
        success:function(data){ // в случае успешного завершения
            console.log("Завершилось успешно"); // выведем в консоли успех 
            console.log(data); // и что в ответе получили, если там что-то есть
        },
        error: function(data){ // в случае провала
            console.log("Завершилось с ошибкой"); // сообщение об ошибке
            console.log(data); // и данные по ошибке в том числе
        }
    });
}))


// render({
//     "vk": {
//         "url": "https://vk.com/silantevdenis",
//         "profile.status": "Open",
//         "profile.photo_url": "https://sun6-21.userapi.com/impf/c845418/v845418828/12d0b3/EK7eNuy-hkc.jpg?size=200x0&quality=90&crop=934,832,711,711&sign=2cd3ed785fd2562c0c5a28ba51fb8506&ava=1",
//         "profile.common": {
//           "Birthday": "August 30, 1997",
//           "Current city": "Moscow",
//           "Relationship": "Married",
//           "Institution": "МАИ"
//         }
//       },
//     "nalog": {
//       "company": [
//         {
//           "ИНН": "7453274002",
//           "ОГРН": "1147453010693",
//           "НаимСокрЮЛ": "ООО \"ИСС\"",
//           "НаимПолнЮЛ": "ООО \"ИС-СЕРВИС\"",
//           "ДатаОГРН": "2014-10-14",
//           "Статус": "Действующее",
//           "АдресПолн": "обл. Челябинская, г. Челябинск, ул. Сони Кривой, д.38, оф.50",
//           "ОснВидДеят": "Торговля оптовая зерном, необработанным табаком, семенами и кормами для сельскохозяйственных животных",
//           "ГдеНайдено": "ФИО бывшего учредителя (Варламов Илья Сергеевич, ИННФЛ: 744716492605)",
//           "ДатаПрекр": NaN,
//           "ФИОПолн": NaN
//         },
//         {
//           "ИНН": "7451431122",
//           "ОГРН": "1177456105221",
//           "НаимСокрЮЛ": "ООО \"МСК\"",
//           "НаимПолнЮЛ": "ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ \"МСК\"",
//           "ДатаОГРН": "2017-12-19",
//           "Статус": "Действующее",
//           "АдресПолн": "обл. Челябинская, г. Челябинск, ул. Курчатова, д.2, пом.8",
//           "ОснВидДеят": "Деятельность вспомогательная прочая, связанная с перевозками",
//           "ГдеНайдено": "ФИО учредителя (Варламов Илья Сергеевич, ИННФЛ: 744716492605)",
//           "ДатаПрекр": NaN,
//           "ФИОПолн": NaN
//         }
//       ]
//     }
//   })



//////////////// вставляем карточки ///
function render(data){
    //////////////// проверка данных 
    // общая проверка
    if(data.length < 1){ alert("Сервер прислал пустые данные"); return false;}


    ///////////////////  формируем html 
    const recomm = `
        <!-- Блок с оценкой -->
        <br><br>
        <h2>Рекомендации</h2>
        <br>
        <div class="card" style="width: 100%;">
            <div class="card-body">
                <h5 class="card-title">Оценка кредитного профиля</h5>
                <hr>
                <!--<h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>-->
                <p>
                    `+data.vk["profile.name"]+` `+data.vk["profile.common"].Birthday+` 
                </p>
                <h4>Рейтинг</h4>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-`+data.recommColor+`" role="progressbar" style="width: `+data.rating+`%;" aria-valuenow="`+data.rating+`" aria-valuemin="0" aria-valuemax="100">`+data.rating+`%</div>
                </div>
                <br>
                <h4 class="text-`+data.recommColor+`">`+data.recomm+`</h4>             
            </div>
        </div>
    `;

    const vk = `
        <!-- Блоки с данными -->
        <br><br>
        <h2>Источники данных</h2>
        <br>
        <div class="card" style="width: 100%;">
            <div class="card-body">
                <h5 class="card-title">ВК</h5>
                <hr>
                <!--<h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>-->
                <div class="media">
                    <img height="64px" width="64px" src="`+data.photo+`" class="mr-3" alt="...">
                    <div class="media-body">
                        <h5 class="mt-0">`+data.vk["profile.name"]+`</h5>
                        `+data.sex+`, `+ moment().diff(moment(data.birthday, 'DD.MM.YYYY'), 'years') +` лет 
                        <a href="`+data.vk.url+`" target="_blank">Страница в VK</a>
                    </div>
                </div>

            </div>
        </div>
    `; 




    //////////  компании 
    
    let company = ``
    // перебираем компании
    data.company.forEach(comp => {
        // добавляем отступы
        company += "<p>"
        // перебираем данные компании
        for(key in comp){
            // добавляем в html 
            company += key+": "+comp[key] + "<br> "
        }

                // добавляем отступы
                company += "</p>"
    })

    const companyHTML = `
    <br>
    <div class="card" style="width: 100%;">
        <div class="card-body">
            <h5 class="card-title">Компании</h5>
            <hr>
            <!--<h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>-->
            `+company+`
        </div>
    </div>
    
    `



    //// вставляем html 
    $("#info").html(recomm+ vk + companyHTML)


}// end render


    
})// end document ready



