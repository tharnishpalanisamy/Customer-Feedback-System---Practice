Customer Plus - Customer Feedback Management 

Overview 
Customer plus is a responsive Web based application that enables users to submit feedback and receive response from the admin 
Users can submit feedback with the informations about the feedback as well as to which departmentthey are giving feedback 
the administrator can review , analyse and respond to their feedback 

The project is designed with separate User and Admin modules, providing a clean interface, responsive design, and role-based functionality.

Features 
User Module 
1) Registration and Login 
2) Authentication 
3) User Dashboard Statistics
4) Feedback Submission 
5) View feedback Submitted By them 
6) Edit and Delete Pending feedback 
7) Search and Filter feedback 
8) View Profile 
9) Update Profile 


Admin Module 
1) Admin Login 
2) Admin Dashboard Statistics 
3) View Recent feedback 
4) View All feedback 
5) filtering and searching feedback 
6) View and Respond to feedback
7) View all Users 
8) Edit , Activate and Deactivate users 
9) Filter and Search users
10) View Profile 
11) Edit Profile 


Technologies Used
Frontend
1) HTML5
2) CSS3
3) Bootstrap 5
4) JavaScript (ES6)


Backend & Database
1) JSON Server


Libraries
1) Jquery
2) Bootstrap Icons
3) SweetAlert2
4) Toastr


User WorkFlow  
1) User registers / creates account and login the application 
2) The logged in user is redirected to the user dashboard page 
3) The user dashboard page consists of all the user statistics , navigation link and share feedback feature 
4) The share feedback feature is used to submit a feedback 
5) The user has to enter the Title , select the department  , enter feedback and rating 
6) That feedback is stored in the database and can be viewed by the user 
7) The submitted feedback can be edited or deleted when its status is pending 
8) The user can navigate to / view specific feedback by clicking on the dashboard statistics cards 
9) The user feedback page consists of all the feedback of the user sorted by recent date 
10) The user feedback page also has filtering options like filter by rating , department and status 
11) The user feedback page also has seaching feature that can be used to search a feedback by its title 
12) The feedback are neatly displayed by using paginations and displaying only 10 records per page 
13) The user profile page has all the details of the users 
14) The Details of the user is neatly presented and users can also edit their details 
15) The user profile page also has all the statistics of the users account 


Admin Workflow 
1) The Admin can login into the application by selecting the role as admin in the login page 
2) After the login the admin is redirected to the admin dashboard page 
3) The admin dashboard page consists of all the statistics of the application 
4) The admin can directly view those feedback in detailed by clicking them  
5) The admin dashboard page also display 5 most recent feedback with the options to view them 
6) The Admin Dashboard includes rating distribution charts that visualize the feedback ratings received. It also provides department-wise average rating charts, helping identify high-performing departments and those that require improvement.
7) The dashboard consists of navigation options for the admin to view feedback , users and profile 
8) The feedback page contains all the feedback received Ordered by Recent  
9) The details are presented neatly by using pagination , displaying only 10 records perpage 
10) The feedback page has filtering options like filter by rating , department and status 
11) The feedback page also has seaching feature that can be used to search a feedback by its title 
12) The Users Page displays all the users in the application 
13) The user details are presented neatly by using pagination 
14) The user page has filtering options like filter by role and status 
15) The user page also has a search feature where the admin can search user by name 
16) The users page had features like Edit , Activate and Deactivate user . 
17) The Edit option is used to edit the details of the user like changing Name , email or role  
18) The Activate feature is used to activate a deactivated user
19) The Deactivate feature is used to Deactivate a Active user
20) The profile page is used to view the details of the admin 
21) The profile page also has edit option where the admin can change his informations like name , email or phone . 



Key Features
1) Responsive UI
The application adopts and adjusts according to all screen sizes while maintaining clean UI 

2) Dark & Light Theme
The application supports both light and dark theme with clean and complimenting colors 

3) Client-side Validation
The application validates user inputs such as email, password, phone number, feedback details, ratings, and required fields before submission, ensuring accurate and consistent data.Search Functionality


4) Filtering
The page has several filtering options like filter by rating , department , status , role etc..  , All the filters 
correctly integrate and work togther giving a nice filter chaining experience 

5) Dynamic Filtering 
The App uses a different filtering system to provide a clean and seemless experience for the users . Dashboard statistic cards automatically navigate to the relevant page and apply the corresponding filters, enabling quick access to specific data without manual filtering.

6) Pagination
All the Details are neatly presented by using pagination ensuring the page looks clean and compact . 
By using pagination only 10 records are displayed per page  

7) Toast Notifications
The Application uses Toastr to provide necessary alert messages to the user in a clean manner . 

8) Confirmation Dialogs
The application uses sweetAlert2 to show conformation messages during critical operations like logout , delete etc.. 

