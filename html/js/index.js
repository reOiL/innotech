
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

    const egrl = `
    <br>
    <div class="card" style="width: 100%;">
        <div class="card-body">
            <h5 class="card-title">ЕГРЮЛ</h5>
            <hr>
            <!--<h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>-->
            
            <p>
                Пупкин Василий Александрович 06.12.1991 г.р.
            </p>
            <p>
                ООО "развод" была ликвидирована 01.02.2017
            </p>
            <p>
                ООО "лохотрон" была ликвидирована 01.02.2017
            </p>

        </div>
    </div>
    
    `



    //// вставляем html 
    $("#info").html(recomm+ vk + egrl)


}// end render


    
})// end document ready



