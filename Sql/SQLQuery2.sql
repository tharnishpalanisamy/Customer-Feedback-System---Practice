--SQL Queries:

--CREATING USER

CREATE TABLE USERS(
	 id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(), 
	userName VARCHAR(30), 
	email VARCHAR(50) , 
	password VARCHAR(30) , 
	role VARCHAR(10) DEFAULT 'USER' , 
	createdOn DATETIME DEFAULT GETDATE(), 
	phone CHAR(10) DEFAULT 'NA' , 
	status VARCHAR(10) DEFAULT 'ACTIVE' 
)


--CREATING FEEDBACK 

CREATE TABLE feedbacks (
	id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID() , 
	userId UNIQUEIDENTIFIER  FOREIGN KEY REFERENCES USERS(id) , 
	userName VARCHAR(30) , 
	email VARCHAR(50) , 
	title VARCHAR(50) , 
	department VARCHAR(20) , 
	feedback VARCHAR(100) , 
	rating CHAR(1) , 
	createdOn DATETIME DEFAULT GETDATE(), 
	response VARCHAR(100) DEFAULT '-', 
	respondedOn DATETIME DEFAULT  NULL , 
	status VARCHAR(10) DEFAULT 'PENDING', 
	updatedOn DATETIME
)

--1. Display all records

SELECT * 
FROM feedbacks

--2. Display active records
--USER
SELECT * 
FROM USERS 
WHERE status = 'Active' 

--FEEDBACK
SELECT * 
FROM feedbacks 
WHERE status = 'Pending' 


--3. Display inactive records

--USER
SELECT * 
FROM USERS 
WHERE status = 'In Active' 

--FEEDBACK
SELECT * 
FROM feedbacks 
WHERE status = 'Responded' 


--4. Search by name
DECLARE @NAME VARCHAR(30) = 'SAMPLE ' 

SELECT * 
FROM USERS 
WHERE userName LIKE '%' + @NAME + '%' 

--5. Count total records
--USER
SELECT COUNT(*) AS TotalUsers
FROM USERS 

--FEEDBACKS 
SELECT COUNT(*) AS TotalFeedbacks
FROM feedbacks 


--6. Count records by status
--USER 
SELECT (
SELECT COUNT(*) FROM USERS 
WHERE status = 'Active' ) AS Active , 
(
SELECT COUNT(*) FROM USERS 
WHERE status = 'In Active') AS InActive 


--FEEDBACK 
SELECT (
SELECT COUNT(*) 
FROM feedbacks 
WHERE status = 'Pending'
) AS Pending , 
(SELECT COUNT(*) 
FROM feedbacks 
WHERE status = 'Responded') AS Responded 

--CAN ALSO USE CASE 

SELECT 
COUNT (CASE WHEN status = 'Active' THEN 1 ELSE 0 END ) AS Active , 
COUNT (CASE WHEN status = 'In Active' THEN 1 ELSE 0 END ) AS InActive 
FROM USERS



--7. Display recently added records
--USERS 
SELECT * 
FROM USERS 
WHERE DATEDIFF(DAY,createdOn , GETDATE()) <= 3 

--FEEDBACKS 
SELECT * 
FROM feedbacks 
WHERE DATEDIFF(DAY,createdOn , GETDATE()) <= 3 


--8. Display records within date range
DECLARE @FROMDATE DATE = '2026-05-04' 
DECLARE @TODATE DATE = '2026-06-06' 



--9. Display top 5 records

SELECT TOP 5 * 
FROM feedbacks 
ORDER BY createdOn DESC 

--10. Display summary report

SELECT f.id , f.title , f.feedback ,f.department, f.rating , f.createdOn , f.status ,
u.id , u.userName , u.email , u.role 
FROM feedbacks f
JOIN USERS u 
ON u.id = f.userId 
