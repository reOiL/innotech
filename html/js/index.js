
$(document).ready(()=>{


/////////////////// отправка формы //////////////////////// 
$("#photoForm").submit(function(){
    // отправляем
    $.post(
        '/photo', 
         $("#photoForm").serialize(), // отправляемые данные          
        
        render(data) // передаем полученные данные дальше
    );
    
    // блокируем отправку формы
    return false;
});

render({
   
    "fullName"    : "Иванов Иван Иванович",
    "birthday"    : "20.08.1991",
    "sex"         : "м",
    "vkId"        : "ivanovivanich",
    "vkPath"      : "https://vk.com/",
    "rating"      : 25,
    "recomm"      : "Не выдавать кредит",
    "recommColor" : "danger",
    "photo"       : "https://sun9-60.userapi.com/impg/O0SSg6xjVQiM0OFgdD3ZVnp2dMQbGxnRrkFkiA/-nUD8qYD3Nk.jpg?size=1214x2160&quality=96&proxy=1&sign=aa73f767ca17f444c17a23b8b909f0cc",
    "company": [
        {
          "ИНН": "2536272105",
          "ОГРН": "1142536003477",
          "НаимСокрЮЛ": "ООО \"ЦВЕТКОВА\"",
          "НаимПолнЮЛ": "ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ \"ЦВЕТКОВА\"",
          "ДатаОГРН": "2014-04-17",
          "Статус": "Действующее",
          "АдресПолн": "край Приморский, г. Владивосток, ул. Отлогая, д.10, оф.7",
          "ОснВидДеят": "Предоставление услуг парикмахерскими и салонами красоты",
          "ГдеНайдено": "Наименование ЮЛ полное"
        },
        {
          "ИНН": "7838378033",
          "ОГРН": "1077847197196",
          "НаимСокрЮЛ": "ООО \"ЮВЕЛИРНЫЙ ДОМ \"ЕЛЕНА ЦВЕТКОВА\"",
          "НаимПолнЮЛ": "ООО \"ЮВЕЛИРНЫЙ ДОМ \"ЕЛЕНА ЦВЕТКОВА\"",
          "ДатаОГРН": "2007-03-26",
          "Статус": "Действующее",
          "АдресПолн": "г. Санкт-Петербург, ул. Галерная, д.32, лит.А, пом.2Н",
          "ОснВидДеят": "Торговля розничная спортивным оборудованием и спортивными товарами в специализированных магазинах",
          "ГдеНайдено": "Наименование ЮЛ"
        }
    ]
}
)

//////////////// вставляем карточки ///
function render(data){

    // немного проверяем данные
    if(data.length < 1){
        alert("Сервер прислал пустые данные");

        return false;
    }

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
                    `+data.fullName+` `+data.birthday+` г.р.
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
                        <h5 class="mt-0">`+data.fullName+`</h5>
                        `+data.sex+`, `+ moment().diff(moment(data.birthday, 'DD.MM.YYYY'), 'years') +` лет 
                        <a href="`+data.vkPath+data.vkId+`" target="_blank">VK</a>
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



