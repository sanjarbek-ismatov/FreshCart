<?php
    $data = ['ok'=>false,'code'=>null,'message'=>null,'result'=>[]];
    $allowed_media = ['jpg','png','jpeg','svg'];
    // call db config
    require_once("../assets/config.php");
    $db = new DB_CONFIG();

    // get api method
    $url = explode("/", $_SERVER['QUERY_STRING']);
    $method = $url[1];

    if($method == 'addProduct'){
        if(isset($_REQUEST['productName'])
            && isset($_REQUEST['token'])
            && isset($_REQUEST['cost'])
            && isset($_REQUEST['productOwner'])
            && isset($_FILES['img1'])
            && isset($_FILES['img2'])
            && isset($_FILES['img3'])
            && isset($_REQUEST['description'])
            && isset($_REQUEST['category'])
            && isset($_REQUEST['weight'])){
            //check owner in db
            $token = $_REQUEST['token'];
            $slt = $db->selectWhere('users',[
                'temporary_token'=>$token,
                'cn'=>'='
            ]);
            if(mysqli_num_rows($slt)>0){
                // user found start writing datas to db
                $name = $_REQUEST['productName'];
                $owner = $_REQUEST['productOwner'];
                $category = $_REQUEST['category'];
                $about = $_REQUEST['description'];
                $weight = $_REQUEST['weight'];
                $cost= $_REQUEST['cost'];
                $img1 = $db->escapeString($_FILES['img1']['name']);
                $img2 = $db->escapeString($_FILES['img2']['name']);
                $img3 = $db->escapeString($_FILES['img3']['name']);
                // download media
                $typeMedia1 = pathinfo($img1, PATHINFO_EXTENSION);
                $typeMedia2 = pathinfo($img2, PATHINFO_EXTENSION);
                $typeMedia3 = pathinfo($img3, PATHINFO_EXTENSION);

                // check file type
                if(in_array($typeMedia1, $allowed_media)
                    && in_array($typeMedia2, $allowed_media)
                    && in_array($typeMedia3, $allowed_media)){
                        // ckeck file in `images` folder
                        if(file_exists('../assets/images/'.$img1)
                            && file_exists('../assets/images/'.$img2)
                            && file_exists('../assets/images/'.$img3)){
                                // the file is excist in images folder so that give random name for it
                                $img1 = bin2hex(random_bytes(8)) . $img1;
                                $img2 = bin2hex(random_bytes(8)) . $img2;
                                $img3 = bin2hex(random_bytes(8)) . $img3;
                        }
                            // write datas to db and download media
                            $ins = $db->insertInto('products',[
                            'product_name'=>$name,
                            'product_owner'=>$owner,
                            'about_product'=>$about,
                            'product_category'=>$category,
                            'weight'=>$weight,
                            'cost'=>$cost,
                            'img1'=>$img1,
                            'img2'=>$img2,
                            'img3'=>$img3,
                        ]);
                        if($ins){
                            move_uploaded_file($_FILES['img1']['tmp_name'], "../assets/images/".$img1);
                            move_uploaded_file($_FILES['img2']['tmp_name'], "../assets/images/".$img2);
                            move_uploaded_file($_FILES['img3']['tmp_name'], "../assets/images/".$img3);

                            $data['ok'] = true;
                            $data['code'] = 200;
                            $data['message'] = "Product successfully added";
                        }else {
                            $data['message'] = 'Service Unavailable | Something wrong went please try again later';
                            $data['code'] = 503;
                        }

                    } else {
                        $data['message'] = 'File type is not allowed';
                        $data['ok'] = 403;
                    }

            } else {
                $data['message'] = 'User not found, Adding product is forbidden';
                $data['code'] = 403;
            }

        } else {
            $data['message'] = "There are no all required datas";
            $data['code'] = 404;
        }
    } 
    if($method == 'signup'){
        if(isset($_REQUEST['name']) && isset($_REQUEST['username']) && isset($_REQUEST['phone']) && isset($_REQUEST['email']) && isset($_REQUEST['password'])){
                $name = $db->escapeString($_REQUEST['name']);
                $username = $db->escapeString($_REQUEST['username']);
                $phone = $db->escapeString($_REQUEST['phone']);
                $email = $db->escapeString($_REQUEST['email']);
                $pass = $db->escapeString($_REQUEST['password']);
                $token = bin2hex(random_bytes(32));
                // check db for username and phone
                $slt = $db->selectWhere('users',
                    [
                        'username'=>$username,
                        'cn'=>'='
                    ],
                    [
                        'phone'=>$phone,
                        'cn'=>'='
                    ],
                    [
                        'email'=>$email,
                        'cn'=>'='
                    ]
                );
//                print_r($slt->num_rows);
                if(!$slt->num_rows>0){
                    $pass = md5($pass);
                    $ins = $db->insertInto('users',[
                        'name'=>$name,
                        'username'=>$username,
                        'phone'=>$phone,
                        'email'=>$email,
                        'password'=>$pass,
                        'temporary_token'=>$token
                    ]);
                    if($ins){
                        $data['ok'] = true;
                        $data['code'] = 200;
                        $data['message'] = "User successfully registered";
                        $data['result'][] = $token;
                    } else {
                        $data['code'] = 503;
                        $data['message'] = "Service Unavailable | Something wrong wnt try again later";
                    }
                }else {
                    $data['code'] = 406;
                    $data['message'] = "username or phone is already token";
                }
            } else {
                $data['code'] = 404;
                $data['message'] = "There are not all reqired datas";
            }
    } 
    if($method == 'login') {
        if(isset($_REQUEST['email']) && isset($_REQUEST['password'])){
            $email = $db->escapeString($_REQUEST['email']);
            $password = $db->escapeString($_REQUEST['password']);
            $password = md5($password);

            // check db for user 
            $check = $db->selectWhere('users',
                [
                    'password'=>$password,
                    'cn'=>'=',
                ],
                [
                    'email'=>$email,
                    'cn'=>'='
                ]    
            );
            if($check-num_rows>0){
                foreach ($check as $key => $value) {
                    $data['result'][] = $value;
                }
                $data['ok'] = true;
                $data['code'] = 200;
                $data['message'] = "User found";
            } else {
                $data['code'] = 404;
                $data['message'] = 'Email or password is not suitable';
            }
        } else {    
            $data['code'] = 404;
            $data['message'] = "Email and password are required";
        }
    }

    print_r(json_encode($data));
    
?>
