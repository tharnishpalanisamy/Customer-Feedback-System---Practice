--USER EMAIL 
--UNIQUE INDEX
CREATE UNIQUE  NONCLUSTERED INDEX Users_Unique_email_index  
ON USERS(email) 


--USER ID IN FEEDBACKS 
CREATE NONCLUSTERED INDEX Userid_Feedback_Index 
ON feedbacks(userId)


--DEPARTMENT FILTER INDEX
CREATE NONCLUSTERED INDEX Department_feedback_Index 
ON feedbacks(department) 


--STATUS FILTER INDEX 

CREATE NONCLUSTERED INDEX Status_Feedback_Index
ON feedbacks(status);

--RECENT FEEDBACKS INDEX
CREATE NONCLUSTERED INDEX Recent_Feedback_Index
ON feedbacks(createdOn DESC);