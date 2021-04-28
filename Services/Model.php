<?php

    namespace Services;

    class Model{
        function __construct($parameters) {
            $host=$parameters['dbhost'];
            $port=$parameters['dbport'];
            $dbname=$parameters['dbname'];
            $user=$parameters['dbuser'];
            $passwd=$parameters['dbpass'];            
            
            try {
                $this->pdo=new \PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $passwd);  
            }
            catch(Exception $e) {
                $this->pdo=null;
            } 
            
            $this->create_tables();
        }
        
        private $pdo;

        function create_tables(){
            if($this->pdo!=null){
                $sql="CREATE TABLE IF NOT EXISTS tasks_repository (
                        id serial,
                        user_name varchar(255) NOT NULL,
                        email varchar(255) NOT NULL,
                        task_text text NOT NULL,
                        task_status varchar(32) NOT NULL,
                        task_edited varchar(32) NOT NULL,
                        PRIMARY KEY (id))
                        DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;";
                $this->pdo->query($sql);                
            }
        }
        
        function request($sql, $vars){
            try {
                $statement = $this->pdo->prepare($sql);                
                $statement->execute($vars);

                return $statement;
            }
            catch(Exception $e) {
                return null;
            }
        }

        function database_task_change($vars, $task_id){
            if($this->pdo!=null){
                
                $sql="SELECT task_text FROM tasks_repository WHERE id=?";
                $statement = $this->request($sql, array($task_id));
                $result = $statement->fetchAll();
                
                if(count($result)>0){  
                    if($result[0]['task_text']!=$vars[0]){  
                        $vars[]='ok';
                        $vars[]=$task_id;
                        
                        $sql="UPDATE tasks_repository SET task_text = ?, task_edited = ? WHERE id = ?;";
                        if($this->request($sql, $vars)!=null){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        
        function database_task_save($vars){
            if($this->pdo!=null){
                $sql="SELECT task_text FROM tasks_repository WHERE user_name=? AND email=?";
                $statement = $this->request($sql, array_slice($vars, 0, count($vars)-1));
                $result = $statement->fetchAll();
                
                if(count($result)==0){
                    $vars[]='non';
                    $vars[]='non';
                    
                    $sql="INSERT INTO tasks_repository (user_name, email, task_text, task_status, task_edited) VALUES (?, ?, ?, ?, ?);";
                    if($this->request($sql, $vars)!=null){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        
        function update_task_status($vars){
            if($this->pdo!=null){
                
                $sql="UPDATE tasks_repository SET task_status = ? WHERE id = ?;";
                if($this->request($sql, $vars)!=null){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        
        function select_tasks($tasks_count, $page_index, $sort_field, $sort_type){
            if($this->pdo!=null){
                $offcet=$page_index*$tasks_count;        
                $sql="SELECT user_name, email, task_text, task_status, task_edited, id FROM tasks_repository "
                        . "ORDER BY $sort_field $sort_type LIMIT $tasks_count OFFSET $offcet ";
                $statement = $this->pdo->query($sql);

                return $statement->fetchAll();
            }
            else{
                return null;
            }
        }
        
        function select_tasks_count(){
            if($this->pdo!=null){        
                $sql="SELECT id FROM tasks_repository";
                $statement = $this->pdo->query($sql);
                $result=$statement->fetchAll();

                return count($result);
            }
            else{
                return 0;
            }
        }
    }
