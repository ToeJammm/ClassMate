//Contains all of the functions for adding data to the database
// Each function takes in a poolConnection and the necessary parameters for the data to be added and returns the resulting recordset, which is the data that was added to the database

import sql from 'mssql'; //needed for parametrization

export async function addUser(poolConnection, email, uniID, userName) { //hard code uniID to 1
    try {
        console.log("Adding user " + email + " at Uni " + uniID + " to database with a userName " + userName);
        let resultSet = await poolConnection.request()
        .input('email', sql.VarChar, email)
        .input('uniID', sql.Int, uniID)
        .input('userName', sql.VarChar, userName)
        .query(`
            -- Begin a transaction to ensure atomicity
            BEGIN TRANSACTION;
            
            -- Step 1: Determine the highest UserID currently in the table
            DECLARE @maxUserID INT;
            SELECT @maxUserID = MAX(UserID) FROM Users;
            
            -- Step 2: Increment the highest UserID by 1
            SET @maxUserID = ISNULL(@maxUserID, 0) + 1;
            
            -- Step 3: Insert the new user into the table
            INSERT INTO [dbo].[Users] (UserID, Email, UniID, userName) 
            VALUES (@maxUserID, @email, @uniID, @userName);
            
            -- Step 4: Commit the transaction
            COMMIT;
            
            -- Step 5: Select the details of the new user
            SELECT * FROM Users WHERE UserID = @maxUserID;
            `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function addUniversity(poolConnection, name) {
    try {
        console.log("Adding university " + name + " to database");
        let resultSet = await poolConnection.request()
        .input('name', sql.VarChar, name)
        .query(
            `
            -- Begin a transaction to ensure atomicity
            BEGIN TRANSACTION;

            DECLARE @maxUniID INT;
            SELECT @maxUniID = MAX(UniID) FROM University;
            SET @maxUniID = ISNULL(@maxUniID, 0) + 1;

            INSERT INTO [dbo].[University] (UniID, UniName) 
            VALUES (@maxUniID, @name);

            COMMIT;

            SELECT * FROM University WHERE UniID = @maxUniID;
            `
        );
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function addClass(poolConnection, className, classNum, classTypeID) {
    try {
        console.log("Adding class " + className + " to database");
        let resultSet = await poolConnection.request()
        .input('className', sql.VarChar, className)
        .input('classNum', sql.Int, classNum)
        .input('classTypeID', sql.Int, classTypeID)
        .query(`
        -- Begin a transaction to ensure atomicity
        BEGIN TRANSACTION;

        DECLARE @maxID INT;
        SELECT @maxID = MAX(ClassID) FROM Class;
        SET @maxID = ISNULL(@maxID, 0) + 1;

        INSERT INTO [dbo].[Class] (ClassID, ClassName, ClassNum, ClassTypeID) 
        VALUES (@maxID, @className, @classNum, @classTypeID);

        COMMIT;

        SELECT * FROM Class WHERE ClassID = @maxID;
        `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

//Note that a Comment AUTOMATICALLY adds a Difficulty, so we don't need to add a Difficulty separately
//When a user wants to vote on difficulty, they will be adding a Difficulty. They can also add a comment, but they do not have to. Each user is entitled
//to either one difficulty or one difficulty and one comment per class, but not more than one. In the front end, I would imagine this working like voting 
//and adding a comment if they so desire
export async function addComment(poolConnection, userID, comment, termTaken, grade, classID, difficultyValue, qualityValue, professorID) {
    //comment = comment.replaceAll("'", "''");
    console.log("Printing parameters:");
    console.log("userID: " + userID);
    console.log("Comment: " + comment);
    console.log("termTaken: " + termTaken);
    console.log("grade: " + grade);
    console.log("classID: " + classID);
    console.log("difficultyValue: " + difficultyValue);
    console.log("qualityValue: " + qualityValue);
    console.log("professorID: " + professorID);

    try {
        console.log("Adding comment: '"  + comment + "' to database");
        let resultSet = await poolConnection.request()
        .input('difficultyValue', sql.Int, difficultyValue)
        .input('professorID', sql.Int, professorID)
        .input('userID', sql.Int, userID)
        .input('classID', sql.Int, classID)
        .input('qualityValue', sql.Int, qualityValue)
        .input('comment', sql.VarChar, comment)
        .input('termTaken', sql.VarChar, termTaken)
        .input('grade', sql.VarChar, grade)
        .query(`
        -- Begin a transaction to ensure atomicity
        BEGIN TRANSACTION;

        -- Adding the new difficulty first
        DECLARE @maxID INT;
        SELECT @maxID = MAX(DifficultyID) FROM Difficulty;
        SET @maxID = ISNULL(@maxID, 0) + 1;

        INSERT INTO [dbo].[Difficulty] (DifficultyID, DifficultyValue, ProfessorID, UserID, ClassID, QualityValue) 
        VALUES (@maxID, @difficultyValue, @professorID, @userID, @classID, @qualityValue);

        -- Junction table Class_Professors (if needed)

        MERGE INTO [dbo].[Class_Professors] AS target
        USING (VALUES (@classID, @professorID)) AS source (ClassID, ProfessorID)
        ON (target.ClassID = source.ClassID AND target.ProfessorID = source.ProfessorID)
        WHEN NOT MATCHED THEN
            INSERT (ClassID, ProfessorID)
            VALUES (source.ClassID, source.ProfessorID);

        -- Now adding the comment
        DECLARE @maxCID INT;
        SELECT @maxCID = MAX(CommentID) FROM Comments;
        SET @maxCID = ISNULL(@maxCID, 0) + 1;

        INSERT INTO [dbo].[Comments] (Comment, TermTaken, Grade, CommentID, UserID, ClassID, DifficultyID, PostDate, CommentScore) 
        VALUES (@comment, @termTaken, @grade, @maxCID, @userID, @classID, @maxID, CURRENT_TIMESTAMP, 0);

        -- Commit the transaction
        COMMIT;

        -- Select the details of the newly added comment
        SELECT * FROM Comments WHERE CommentID = @maxCID;
        `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function addProfessor(poolConnection, name, universityID) {
    try {
        console.log("Adding professor " + name + " to database");
        let resultSet = await poolConnection.request()
        .input('name', sql.VarChar, name)
        .input('universityID', sql.Int, universityID)
        .query(
            `
            -- Begin a transaction to ensure atomicity
            BEGIN TRANSACTION;

            DECLARE @maxID INT;
            SELECT @maxID = MAX(ProfessorID) FROM Professors;
            SET @maxID = ISNULL(@maxID, 0) + 1;

            INSERT INTO [dbo].[Professors] (ProfessorID, Name, UniID) 
            VALUES (@maxID, @name, @universityID);
        
            COMMIT;

            SELECT * FROM Professors WHERE ProfessorID = @maxID;
            `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function addClassType(poolConnection, name, universityID) {
    try {
        console.log("Adding class type " + name + " to database");
        let resultSet = await poolConnection.request()
        .input('name', sql.VarChar, name)
        .input('universityID', sql.Int, universityID)
        .query(
            `
            -- Begin a transaction to ensure atomicity
            BEGIN TRANSACTION;

            DECLARE @maxID INT;
            SELECT @maxID = MAX(ClassTypeID) FROM ClassType;
            SET @maxID = ISNULL(@maxID, 0) + 1;

            INSERT INTO [dbo].[ClassType] (ClassTypeID, ClassType, UniID) 
            VALUES (@maxID, @name, @universityID);
        
            COMMIT;

            SELECT * FROM ClassType WHERE ClassTypeID = @maxID;
            `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function addDifficulty(poolConnection, difficultyValue, qualityValue, userID, classID, professorID) {
    try {
        console.log("Adding Difficulty of " + difficultyValue + " and quality " + qualityValue + " to database");
        let resultSet = await poolConnection.request()
        .input('difficultyValue', sql.Int, difficultyValue)
        .input('qualityValue', sql.Int, qualityValue)
        .input('userID', sql.Int, userID)
        .input('classID', sql.Int, classID)
        .input('professorID', sql.Int, professorID)
        .query(`
        -- Begin a transaction to ensure atomicity
        BEGIN TRANSACTION;

        DECLARE @maxID INT;
        SELECT @maxID = MAX(DifficultyID) FROM Difficulty;
        SET @maxID = ISNULL(@maxID, 0) + 1;

        -- Adding a new difficulty
        INSERT INTO [dbo].[Difficulty] (DifficultyID, DifficultyValue, ProfessorID, UserID, ClassID, QualityValue) 
        VALUES (@maxID, @difficultyValue, @professorID, @userID, @classID, @qualityValue);

        -- Junction table Class_Professors (if needed)
        MERGE INTO [dbo].[Class_Professors] AS target
        USING (VALUES (@classID, @professorID)) AS source (ClassID, ProfessorID)
        ON (target.ClassID = source.ClassID AND target.ProfessorID = source.ProfessorID)
        WHEN NOT MATCHED THEN
            INSERT (ClassID, ProfessorID)
            VALUES (source.ClassID, source.ProfessorID);

        -- Commit the transaction
        COMMIT;

        -- Select the details of the newly added difficulty
        SELECT * FROM Difficulty WHERE DifficultyID = @maxID;
        `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

export async function addUpvote(poolConnection, userID, commentID) {
    try {
        console.log("Adding vote of " + voteValue + " to database");
        let resultSet = await poolConnection.request()
        .input('userID', sql.Int, userID)
        .input('commentID', sql.Int, commentID)
        .query(`
        -- Begin a transaction to ensure atomicity
        BEGIN TRANSACTION;

        -- Adding a new vote
        INSERT INTO [dbo].[User_Comment_Upvotes] (UserID, CommentID) 
        VALUES (@userID, @commentID);

        -- Commit the transaction
        COMMIT;

        -- Select the details of the newly added vote
        SELECT * FROM Votes WHERE UserID = @userID AND CommentID = @commentID@;
        `);
        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}




export async function addRequest(
    poolConnection,
    userName,
    uniID,
    classID,
    userID,
    professorID,
    universityName,
    professorName,
    className,
    classNum,
    classTypeID,
    comment,
    termTaken,
    grade,
    difficultyValue,
    qualityValue
) {
    try {
        let resultSet = await poolConnection.request()
            .input('userName', sql.VarChar(15), userName)
            .input('uniID', sql.Int, uniID)
            .input('classID', sql.Int, classID)
            .input('userID', sql.Int, userID)
            .input('professorID', sql.Int, professorID)
            .input('universityName', sql.VarChar(255), universityName)
            .input('professorName', sql.VarChar(255), professorName)
            .input('className', sql.VarChar(255), className)
            .input('classNum', sql.VarChar(50), classNum)
            .input('classTypeID', sql.Int, classTypeID)
            .input('comment', sql.Text, comment)
            .input('termTaken', sql.VarChar(50), termTaken)
            .input('grade', sql.VarChar(5), grade)
            .input('difficultyValue', sql.Decimal(3, 2), difficultyValue)
            .input('qualityValue', sql.Decimal(3, 2), qualityValue)
            .query(`
                -- Begin a transaction to ensure atomicity
                BEGIN TRANSACTION;

                -- Insert a new row into the UniversityFeedback table
                INSERT INTO [dbo].[UniversityFeedback] (
                    UniID,
                    ClassID,
                    UserID,
                    RequestID,
                    ProfessorID,
                    UniversityName,
                    ProfessorName,
                    ClassName,
                    ClassNum,
                    ClassTypeID,
                    Comment,
                    TermTaken,
                    Grade,
                    DifficultyValue,
                    QualityValue
                ) VALUES (
                    @uniID,
                    @classID,
                    @userID,
                    @requestID,
                    @professorID,
                    @universityName,
                    @professorName,
                    @className,
                    @classNum,
                    @classTypeID,
                    @comment,
                    @termTaken,
                    @grade,
                    @difficultyValue,
                    @qualityValue
                );

                -- Commit the transaction
                COMMIT;

                -- Select the details of the newly added feedback
                SELECT * FROM [dbo].[UniversityFeedback] 
                WHERE userID = @userID AND comment = @comment;
            `);

        return resultSet.recordset;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}
