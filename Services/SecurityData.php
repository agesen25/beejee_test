<?php

    namespace Services;

    class SecurityData{
        function __construct() {}
        
        private $site_config=array(
            'login'=>'admin', 
            'password'=>'123',             
            'dbhost'=>'127.0.0.1',
            'dbport'=>'3306',
            'dbname'=>'agesen25',
            'dbuser'=>'user1453467',
            'dbpass'=>'fq#$R4GER54G4'
        );
        
        function  auth_validation($auth){
            $login=$auth->login;
            $password=$auth->passwd;
            
            if($this->site_config['login']==$login && $this->site_config['password']==$password){
                return true;
            }
            else{
                return false;
            }            
        }
        
        function get_database_authorization_data(){
            return array_slice($this->site_config, 2, count($this->site_config)-2);
        }
    }    
