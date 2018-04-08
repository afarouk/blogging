<div class="navbar navbar-default navbar-fixed-top header">
    <div class="container-fluid">
        <div class="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1 p-r-0">

            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-collapse-1" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
               <a class="navbar-brand" href="index.php"><img class="img-responsive" src="img/blogging.png" alt=""></a>
            </div>

            <div class="collapse navbar-collapse" id="bs-collapse-1">

                <ul class="nav navbar-nav navbar-right header_element login_status">
                  <!--
                  <li>
                      <a href="admin.php"> Admin </a>

                  </li>
                -->
                  <li class="dropdown">
                      <a href="#" class="dropdown-toggle notification_button" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                          <img src="images/church-bell.png" alt="">
                          <!-- <span class="menuItemText">Notifications</span> -->
                      </a>
                      <!--ul class="dropdown-menu">
                            <li class="disabled"><a href="#">Action</a></li>
                            <li class="disabled"><a href="#">Another action</a></li>
                            <li class="disabled"><a href="#">Something else here</a></li>
                            <li role="separator" class="divider"></li>
                            <li class="disabled"><a href="#">Separated link</a></li>
                      </ul-->
                  </li>
                  <li class="dropdown">
                        <a href="#" class="dropdown-toggle signin_button">
                            <span>Sign in</span>
                            <img class="signin_image" src="images/Sign_in.png" alt="">
                        </a>
                        <ul class="dropdown-menu">
                            <!-- <li class="disabled"><a href="#">My Questions</a></li> -->
                            <li class="disabled"><a href="#">Help</a></li>
                            <li class="disabled"><a href="#">Blog</a></li>
                            <li class="disabled"><a href="#">Privacy & Terms</a></li>
                            <li role="separator" class="divider"></li>
                            <li><a class="signout-button" href="#">Sign in</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="infoPanel">
        <div class="container-fluid">
            <div class="col-md-9 col-md-offset-3 col-sm-12">
                <ul class="nav navbar-nav">
                    <li data-filtertype="TRENDING" class="navigation-link filter_tab"><a href="#">Home</a></li>
                    <li class="navigation-link filters-link">
                        <button type="button" class="navbar-toggle collapsed toggle_btn" data-toggle="collapse" data-target="#bs-collapse-2" aria-expanded="false">
                            Filters<span class="caret"></span>
                        </button>
                        <div class="collapse navbar-collapse collapsed-filters" id="bs-collapse-2">
                            <ul class="nav navbar-nav collapsed-links">
                                <li data-filtertype="CATEGORIES" class="filter_tab"><a href="#">Topics</a></li>
                                <li data-filtertype="TAGS" class="filter_tab"><a href="#">Tags</a></li>
                                <li data-filtertype="TYPE" class="filter_tab"><a href="#">Types</a></li>
                                <li data-filtertype="MYQUESTIONS" class="filter_tab"><a href="#">My Questions</a></li>
                            </ul>
                        </div>
                    </li>
                    <li data-filtertype="HIDEANSWERED" class="navigation-link filter_tab refresh_button">
                        <!-- <a href="#">
                            <span class="glyphicon glyphicon-refresh"></span>
                        </a> -->
                        <div class="checkbox">
                            <label for="hide_answered"><input id="hide_answered" autocomplete="off" type="checkbox" name="name" value=""><img src="images/unanswered_only.png" alt="" /></label>
                        </div>
                    </li>
                    <li class="navigation-link create_question_btn"><a href="#">Create</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>



<!--

<div class="navbar navbar-fixed-top">
    <div class="container">
       <div class="navbar-header">
           <button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".bs-navbar-collapse">
           <span class="sr-only">Toggle navigation</span>
           <span class="icon-bar"></span>
           <span class="icon-bar"></span>
           <span class="icon-bar"></span>
           </button>
           <a href="index.php" class="navbar-brand common_brand">
               <img class="img-responsive" src="img/blogging.png">
           </a>
       </div>
       <nav class="collapse navbar-collapse bs-navbar-collapse" role="navigation">
           <ul class="nav navbar-nav navbar-right common_navigation">
               <li class="dropdown">
                   <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                   <ul class="dropdown-menu">
                       <li><a href="#">Action</a></li>
                       <li><a href="#">Another action</a></li>
                       <li><a href="#">Something else here</a></li>
                       <li role="separator" class="divider"></li>
                       <li><a href="#">Separated link</a></li>
                   </ul>
               </li>
               <li class="dropdown">
                   <a href="#" class="dropdown-toggle signedin p-r-0" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Navigation</a>
                   <ul class="dropdown-menu">
                       <li><a href="questions.php">My Questions</a></li>
                       <li><a href="#">Help</a></li>
                       <li><a href="#">Blog</a></li>
                       <li><a href="#">Privacy & Terms</a></li>
                   </ul>
               </li>
           </ul>
       </nav>
   </div>
</div>
-->
