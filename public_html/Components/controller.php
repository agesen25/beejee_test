<?php
    if(!isset($_SESSION)) {
        session_start();
    }
    
    define('LIB_DIR', __DIR__ . '/../../');    
    spl_autoload_register(function($class) {
        $file = LIB_DIR . str_replace('\\', '/', $class . '.php');
        if (file_exists($file)) 
            require $file; 
    });
        
    $json_str = file_get_contents('php://input', true);
    $data = json_decode($json_str);
    
    $secure = new Services\SecurityData();
    $model = new Services\Model($secure->get_database_authorization_data());    
    $script_answer=array();
        
    if(!isset($_SESSION['sort_field'])) $_SESSION['sort_field']='id';    
    if(!isset($_SESSION['sort_type'])) $_SESSION['sort_type']='ASC';    
    if(!isset($_SESSION['page_index'])) $_SESSION['page_index']=0;
    if(!isset($_SESSION['tasks_on_page'])) $_SESSION['tasks_on_page']=3;
    
    if(isset($data->status)){    
        if(isset($data->status->page_index)){
            if($data->status->page_index!=-1) 
                $_SESSION['page_index']=$data->status->page_index;
        } 
        
        if(isset($data->status->sort_field)){
            if($data->status->sort_field=='name') {
                $_SESSION['sort_field']='user_name';
            }             
            if($data->status->sort_field=='email') {
                $_SESSION['sort_field']='email';
            } 
            if($data->status->sort_field=='status') {
                $_SESSION['sort_field']='task_status';
            }             
        }
        
        if(isset($data->status->sort_type)){
            if($data->status->sort_type=='down') {
                $_SESSION['sort_type']='ASC'; 
            }
            if($data->status->sort_type=='up') {
                $_SESSION['sort_type']='DESC'; 
            }
        }
        
        $sort_field='default';
        if($_SESSION['sort_field']=='user_name'){
            $sort_field='name';
        }
        if($_SESSION['sort_field']=='email'){
            $sort_field='email';
        }
        if($_SESSION['sort_field']=='task_status'){
            $sort_field='status';
        }
        
        $sort_type='down';
        if($_SESSION['sort_type']=='DESC'){
            $sort_type='up';
        }
        
        $tasks_list=get_tasks($model);
        $tasks_count=$model->select_tasks_count(); 
        
        if(isset($_SESSION['user_name'])) {             
            $script_answer=array ('status'=>'ok', 'user_name'=>$_SESSION['user_name'], 'tasks_list'=>$tasks_list, 
                'pages_count'=>ceil($tasks_count/$_SESSION['tasks_on_page']), 'page_index'=>$_SESSION['page_index'],
                'sort_field'=>$sort_field, 'sort_type'=>$sort_type);
        }
        else{
            $script_answer=array ('status'=>'non', 'tasks_list'=>$tasks_list, 'pages_count'=>ceil($tasks_count/$_SESSION['tasks_on_page']), 
                'page_index'=>$_SESSION['page_index'], 'sort_field'=>$sort_field, 'sort_type'=>$sort_type);
        }
    }
    
    if(isset($data->exit)){
        if(isset($_SESSION['user_name'])){
            unset($_SESSION['user_name']);
            unset($_SESSION['sort_field']);
            unset($_SESSION['sort_type']);
            unset($_SESSION['page_index']);
            
            $script_answer=array ('exit'=>'ok');
        }
        else{
            $script_answer=array ('exit'=>'non');
        }
    }  
 
    if(isset($data->auth)){
        $tasks_list= get_tasks($model);
        
        if($secure->auth_validation($data->auth)){
            $_SESSION['user_name']=$data->auth->login;                                
            $script_answer=array ('auth_result'=>'ok', 'user_name'=>$_SESSION['user_name'], 'tasks_list'=>$tasks_list);
        }
        else{
            $script_answer=array ('auth_result'=>'non', 'tasks_list'=>$tasks_list);
        }
    }        
    
    if(isset($data->task_save)){
        $new_task=[];        
        foreach ($data->task_save as $key => $value){
            $new_task[]=htmlspecialchars($value, ENT_QUOTES);
        }
        
        if ($model->database_task_save($new_task)){
            $script_answer=array ('task_save'=>'ok');
        }
        else{
            $script_answer=array ('task_save'=>'non');
        }
    }
    
    if(isset($data->task_change)){
        if(isset($_SESSION['user_name'])) { 
            $new_task=[];        
            $task_id='';
            foreach ($data->task_change as $key => $value){
                if($key!='id')
                    $new_task[]=htmlspecialchars($value, ENT_QUOTES);
                else
                    $task_id=$value;
            }

            if ($model->database_task_change($new_task, $task_id)){
                $script_answer=array ('task_change'=>'ok');
            }
            else{
                $script_answer=array ('task_change'=>'non');
            }
        }
        else{
           $script_answer=array ('task_change'=>'auth_need');
        }
    }
    
    if(isset($data->update_status)){
        if(isset($_SESSION['user_name'])) {   
            $vars=array($data->update_status->action, $data->update_status->id);                        
            
            if ($model->update_task_status($vars)){
                $script_answer=array ('update_status'=>'ok');
            }
            else{
                $script_answer=array ('update_status'=>'non');
            }
        }
        else{
            $script_answer=array ('update_status'=>'auth_need');
        }
    }
    
    echo json_encode($script_answer);
    
 
    function get_tasks($model){        
        if(!isset($_SESSION['page_index'])) {  
             $_SESSION['page_index']=0;
        }
        
        return $model->select_tasks($_SESSION['tasks_on_page'], $_SESSION['page_index'], $_SESSION['sort_field'], $_SESSION['sort_type']); 
    }
