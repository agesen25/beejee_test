function new_task_save(button){
    var parent_form=button.closest('form');    
    var user_name=parent_form.querySelectorAll('#user-name')[0];
    var user_email=parent_form.querySelectorAll('#user-email')[0];
    var user_task=parent_form.querySelectorAll('#user-task')[0];       
    var user_name_text=user_name.value.trim();
    var user_email_text=user_email.value.trim();
    var user_task_text=user_task.value.trim();
    
    var flag_save_to_database=true;
        
    if(user_name_text.search(/[@#$%&?!]+/i)>=0 || user_name_text==''){
        change_style_js(user_name, 1);
        flag_save_to_database=false;
    }    
    if(user_email_text.search(/[@]+/)<0 || user_email_text.length<5){
        change_style_js(user_email, 1);
        flag_save_to_database=false;
    }
    if(user_task_text==''){
        change_style_js(user_task, 1);
        flag_save_to_database=false;
    }
    
    if(flag_save_to_database){
        var data = {
                task_save: {'user_name': user_name_text, 'user_email': user_email_text, 'user_task': user_task_text}  
            };

        var message = JSON.stringify(data);     
        message_send(message);
    }
}

function task_change(button){
    var parent_form=button.closest('form');
    var user_task=parent_form.querySelectorAll('#user-task')[0];
    var user_task_text=user_task.value.trim();
    
    var flag_save_to_database=true;
  
    if(user_task_text==''){
        change_style_js(user_task, 1);
        flag_save_to_database=false;
    }
    
    if(flag_save_to_database){
        var data = {
                task_change: {'user_task': user_task_text, 'id': parent_form.id}  
            };

        var message = JSON.stringify(data);     
        message_send(message);
    }
}

function change_style_js(element,mode){
    if(mode==0)
        element.classList.remove('is-invalid');
    if(mode==1)
        element.classList.add('is-invalid');
}

function change_style_jquery(element,mode){
    if(mode==0)
        element.removeClass('is-invalid');
    if(mode==1)
        element.addClass('is-invalid');
}

function task_status_change(button){
    var id=button.closest('form').id;
    var action=button.textContent;
    
    if(action=='???? ????????????????????'){
        action='ok';        
    }
    else{
        action='non';
    }
    
    var data = {
            update_status: {'id': id, 'action': action}
        };

    var message = JSON.stringify(data);     
    message_send(message);
}

function update_page_content_processing(data){    
    if (data.status === 'ok'){
        $('.test-btn-right').text('??????????');  
        $('.user-name').text('???????????????????????? - '+data.user_name); 
    }
    if (data.status === 'non'){
        $('.test-btn-right').text('??????????');
        $('.user-name').text('');
    }
    
    insert_tasks(data);  
    
    $('#user-name').click(function(){
        change_style_jquery($(this), 0);
    });    
    $('#user-email').click(function(){
        change_style_jquery($(this), 0);
    });    
    $('#user-task').click(function(){
        change_style_jquery($(this), 0);
    });
}

function task_form_html_create(tasks_list){    
    return '<form class="p-2 mb-2 new-task-creator">\n\
                    <div class = "row">\n\
                        <div class="col-md-6 mb-2">\n\
                            <label for="user-name" class="form-label">?????? ????????????????????????</label>\n\
                            <input type="text" id="user-name" class="form-control" value="'+tasks_list.user_name+'" required>\n\
                            <div class="invalid-feedback">???????????? ?????????? (???????????? ????????, ?????? ???????????????????????? ???????????????????????? ??????????????)</div>\n\
                        </div>\n\
                            <div class="col-md-6 mb-2">\n\
                            <label for="user-email" class="form-label">Email ????????????????????????</label>\n\
                            <input type="text" id="user-email" class="form-control" value="'+tasks_list.email+'" required>\n\
                            <div class="invalid-feedback">Email ???????????? ??????????????????????</div>\n\
                        </div>\n\
                    </div>\n\
                    <div class = "row">\n\
                        <div class="col-md-12 mb-2">\n\
                            <label for="user-task" class="form-label">??????????????</label>\n\
                            <textarea class="form-control" id="user-task" required>'+tasks_list.task_text+'</textarea>\n\
                            <div class="invalid-feedback">???????????? ????????</div>\n\
                        </div>\n\
                    </div>\n\
                    <div class = "row">\n\
                        <div class="col-md-6 text-left">\n\
                            <button id="task-save-button" class="btn btn-primary" onclick="task_change(this)" type="button">????????????????</button>\n\
                            <button id="task-status" class="btn btn-light" onclick="task_status_change(this)" type="button" disabled></button>\n\
                        </div>\n\
                        <div class="col-md-4">\n\
                            <button id="task-edited" class="btn btn-light" type="button" disabled></button>\n\
                        </div>\n\
                    </div>\n\
                </form>';
}

function insert_tasks(data){  
    $('.tests-container-style').empty();
    
    if(data.tasks_list.length>0){
        var sort_buttons='<button class="btn btn-light" id="sort-by-name" onclick="sort_by_name()" type="button">???? ?????????? ????????????????????????</button>\n\
                          <button class="btn btn-light" id="sort-by-email" onclick="sort_by_email()" type="button">???? email</button>\n\
                          <button class="btn btn-light" id="sort-by-status" onclick="sort_by_status()" type="button">???? ??????????????</button>';
        
        $('#sorting').html(sort_buttons);
    }
    
    for(var i=0;i<data.tasks_list.length;i++){
        $('.tests-container-style').append(task_form_html_create(data.tasks_list[i]));
     
        var form_list = document.querySelectorAll('.new-task-creator');
        form_list[form_list.length-1].id=data.tasks_list[i].id;
        
        var user_name_input=form_list[form_list.length-1].querySelectorAll('#user-name');
        user_name_input[0].readOnly = true;
        
        var user_email_input=form_list[form_list.length-1].querySelectorAll('#user-email');
        user_email_input[0].readOnly = true;
        
        var user_task_input=form_list[form_list.length-1].querySelectorAll('#user-task');
        
        if(data.status === 'non' || data.auth_result === 'non'){
            user_task_input[0].readOnly = true;
            
            var task_save_button=form_list[form_list.length-1].querySelectorAll('#task-save-button');
            task_save_button[0].remove();
        }
        
        var task_status_button=form_list[form_list.length-1].querySelectorAll('#task-status');
        if(data.tasks_list[i].task_status=='ok'){
            task_status_button[0].textContent='??????????????????';
        }
        if(data.tasks_list[i].task_status=='non'){
            task_status_button[0].textContent='???? ????????????????????';
        }
        
        if(data.status === 'ok' || data.auth_result === 'ok'){
            if(data.tasks_list[i].task_status=='ok'){
                task_status_button[0].disabled=false;
                task_status_button[0].classList.remove("btn-light");
                task_status_button[0].classList.add("btn-success");
            }
            if(data.tasks_list[i].task_status=='non'){
                task_status_button[0].disabled=false;
                task_status_button[0].classList.remove("btn-light");
                task_status_button[0].classList.add("btn-warning");
            }
        }
        
        var task_edited_button=form_list[form_list.length-1].querySelectorAll('#task-edited');
        if(data.tasks_list[i].task_edited=='ok'){  
            task_edited_button[0].textContent='???????????????????????????????? ??????????????????????????????';
        }
        if(data.tasks_list[i].task_edited=='non'){  
            task_edited_button[0].textContent='';
        }
    }
    
    if(data.pages_count>1){
        var pages_navigation_form='<div class = "row">\n\
                                        <div class="col-md-12 mb-2">\n\
                                             <nav aria-label="???????????? ??????????????????">\n\
                                                <ul class="pagination">\n\
                                                </ul>\n\
                                              </nav>\n\
                                          </div>\n\
                                      </div>';

        $('.tests-container-style').append(pages_navigation_form);
        for(var i=0;i<data.pages_count;i++){
            var li_class='page-item'; 
            if(i===data.page_index)
                li_class='page-item active'; 

            $('.pagination').append('<li class="'+li_class+'">\n\
                                        <a class="page-link" href="" onclick="new_page_load(this, '+i.toString()+')">'+(i+1).toString()+'</a>\n\
                                    </li>');
        }
    }
        
    $('#sort-by-name').text('???? ?????????? ????????????????????????');
    $('#sort-by-email').text('???? email');
    $('#sort-by-status').text('???? ??????????????');
    
    if(data.sort_field=='name'){
        $('#sort-by-name').text('???? ?????????? ???????????????????????? ('+data.sort_type+')');
    }
    if(data.sort_field=='email'){
        $('#sort-by-email').text('???? email ('+data.sort_type+')');
    }
    if(data.sort_field=='status'){
        $('#sort-by-status').text('???? ?????????????? ('+data.sort_type+')');
    } 
}

function new_page_load(a, page_index){    
    var parent_ul=a.closest('ul');    
    var li=parent_ul.querySelectorAll('.page-item');
    for(var i=0;i<li.length;i++){
        li[i].classList.remove('active');
    }
    
    update_page_content('non', 'non', page_index);
}

function sort_by_name(){ 
    var text=$('#sort-by-name').text();
    if(text=='???? ?????????? ????????????????????????' || text=='???? ?????????? ???????????????????????? (up)'){
        update_page_content('name', 'down', -1);
    }
    if(text=='???? ?????????? ???????????????????????? (down)'){
        update_page_content('name', 'up', -1);
    }
}

function sort_by_email(){
    var text=$('#sort-by-email').text();
    if(text=='???? email' || text=='???? email (up)'){
        update_page_content('email', 'down', -1);
    }
    if(text=='???? email (down)'){
        update_page_content('email', 'up', -1);
    }
}

function sort_by_status(){
    var text=$('#sort-by-status').text();
    if(text=='???? ??????????????' || text=='???? ?????????????? (up)'){
        update_page_content('status', 'down', -1);
    }
    if(text=='???? ?????????????? (down)'){
        update_page_content('status', 'up', -1);
    }
}

function login_button_text_toggle(){
    var current_user=$('.user-name').text();
    if(current_user==''){
        $('.test-btn-right').text('??????????');
    }
    else{
        $('.test-btn-right').text('??????????');  
    }
}

function authorization_menu_toggle(){
    var button_text=$('.test-btn-right').text();
    if(button_text=='??????????'){
        $('#modal-window').modal('toggle');
        change_style_jquery($('#login'), 0);
        change_style_jquery($('#passwd'), 0);
        
        setTimeout(function(){$('#login').focus();}, 1000);
    }   
    if(button_text=='??????????'){
        authorization_exit();
    }
}

function authorization_data_send(){
    var login=$('#login').val();
    var password=$('#passwd').val();        
    var data = {
            auth: {'login': login, 'passwd': password}
        };
        
    var message = JSON.stringify(data);     
    message_send(message);
}

function authorization_answer_processing(data){

    if (data.auth_result === 'ok'){
        $('#modal-window').modal('toggle');
        $('.user-name').text('???????????????????????? - '+data.user_name);
        login_button_text_toggle();
        update_page_content('non', 'non', -1);
    }
    else{
        change_style_jquery($('#login'), 1);
        change_style_jquery($('#passwd'), 1);       
    }
}

function authorization_exit(){
    var data = {
            exit: ''
        };
        
    var message = JSON.stringify(data);     
    message_send(message);
}

function update_page_content(sort_field, sort_type, page_index){
    var data = {
        status: {'sort_field': sort_field, 'sort_type': sort_type, 'page_index': page_index}  
    };

    var message = JSON.stringify(data); 
    message_send(message);
}

function message_send(message){
    $.ajax({
	url: '/Components/controller.php',
	method: 'post',
	dataType: 'html',
	data: message,
	success: function(data){      
            var data = JSON.parse(data);            
            
            if ('status' in data) {                
                update_page_content_processing(data);
            }                     
            if ('auth_result' in data) {                
                authorization_answer_processing(data);
            }
            if ('exit' in data) {
                $('.user-name').text('');
                login_button_text_toggle();
                update_page_content('non', 'non', -1);              
            }
            if ('task_save' in data) {
                if(data.task_save=='ok'){
                    update_page_content('non', 'non', -1);
                    alert('?????????????? ??????????????????');
                }
                if(data.task_save=='non'){
                    alert('???????????? ???????????????????? ?????? ???????????????????????? ?????? ????????????????????')
                }
            }
            if ('task_change' in data) {
                if(data.task_change=='ok'){
                    update_page_content('non', 'non', -1);
                    alert('?????????????????? ?????????????? ?? ????????');
                }
                if(data.task_change=='auth_need'){
                    alert('???????????????????? ????????????????????. ???????????????????? ??????????????????????.')
                }
            }            
            if ('update_status' in data) {
                if(data.update_status=='ok'){
                    update_page_content('non', 'non', -1);
                }
                if(data.update_status=='non'){
                    alert('???????????? ???????????????????? ????')
                }
                if(data.update_status=='auth_need'){
                    alert('???????????????????? ????????????????????. ???????????????????? ??????????????????????.')
                }
            }
	}
    });  
}
