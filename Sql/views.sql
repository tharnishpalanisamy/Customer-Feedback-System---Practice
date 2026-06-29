--VIEWS

--VIEW FOR VIEWING FULL DETAILS OF FEEDBACK ALONG WITT THE USER 

CREATE VIEW ViewFeedbackDetail
AS
SELECT f.id , f.title , f.feedback ,f.department, f.rating , f.createdOn , f.status ,
u.id , u.userName , u.email , u.role 
FROM feedbacks f
JOIN USERS u 
ON u.id = f.userId 



--VIEW FOR PENDING FEEDBACKS 

CREATE VIEW PendingFeedbacks 
AS
SELECT * FROM 
feedbacks 
WHERE status = 'Pending' 


--ADMIN STATISTICS VIEWS
CREATE VIEW AdminStatistics 
AS
SELECT (
SELECT COUNT(*) FROM feedbacks
) AS TotalFeedback , 
(
SELECT COUNT(*) FROM feedbacks 
WHERE status = 'Pending' ) AS TotalPending , 
(SELECT COUNT(*) FROM feedbacks 
WHERE status = 'Responded') AS TotalResponded , 
(SELECT AVG(rating) FROM feedbacks ) AS AverageRating 
