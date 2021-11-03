<h1> Firebase Security Master Class </h2>

<h2> Match </h2>

Match keywords represent a path in your database, these point to the root of your database.

There are 3 different time of matches,
 - Collection Match
 - Single Document Match
 - Tree Match

 ```
 match /users/jeffd23 {
     // Single document
 }

 match /users/{userId} {
     // Single Collection
 }

 match /posts/{postId=**} {
     // Recursive whildcard, includes all subcollections. (Tree Match example)
     // Applies rule to all subcollections
 }

```

<h2> Allow </h2>

Allow is like a function that returns the Rules specified and applies them to the document specified by Match.

Allows are applied top to bottom, meaning the top allow statement has highest precedence

```
match /users/{docId=**} {
    allow read, write; //any is implied for condition

    allow get; //any is implied for condition
    allow list; //any is implied for condition

    allow create; //any is implied for condition
    allow update; //any is implied for condition
    allow delete; //any is implied for condition
}

```

<h2> Conditions </h2>

In the rules environment, we have access to the Request, and Resource objects.<br> - Request represents the incoming data from a client sided application,
<br> - Request.auth contains the user authentication info.
<br> - Resource represents the data that already exists in the database.

These two global objects can be useful for creating logical conditions
such as allowing a user to only write to a document, if their username on the incoming request resource, matches the resouce data existing in the database.

```
match /users/{docId=**} {
    allow create: <if> <a && b && c && d>;
}

```

<h2> Common Examples </h2>

```javascript
match /users/{userId} {
    // Is user logged in?
    allow read: if request.auth.uid != null; 

    // Match userId path parameter matches auth object uid (confirms ownership)
    allow write: if request.auth.uid == userId;
}

match /todos/{docId} {

    // If someone reads a document that doens't have a status as "draft" or "pending" send error back down,
    allow read: if resource.data.status == "published"

    // Ensures ownership and prevents timing attacks.
    allow create: if request.auth.uid == resource.data.uid 
                  && request.time == request.resource.data.createdAt;

    // Confirm ownership, and restrict which fields user can update.
    allow update: if request.auth.uid == resource.data.uid
                  && request.resource.data.keys().hasOnly(['keys', 'status'])
}

```

<h1> Advanced Concepts </h1>

<h2> Functions </h2>

Take aboves code for example

```javascript
match /users/{userId} {
    // Is user logged in? (Calling function defined below)
    allow read: if isLoggedIn(); 

    // Match userId path parameter matches auth object uid (confirms ownership)
    allow write: if belongsTo();
}

match /todos/{docId} {

    // If someone reads a document that doens't have a status as "draft" or "pending" send error back down,
    allow read: if resource.data.status == "published"

    // Ensures ownership and prevents timing attacks.
    allow create: if belongsTo(userId) 
                  && request.time == request.resource.data.createdAt;

    // Confirm ownership, and restrict which fields user can update.
    allow update: if belongsTo(userId)
                  && request.resource.data.keys().hasOnly(['keys', 'status'])
}

// Example of a rule function
function isLoggedIn() {
    return request.auth.uid != null;
}

function belongsTo(userId) {
    return request.auth.uid == userId || request.authuid == resource.data.uid;
}

// Only available in version 2 (we should be okay)
function canCreateTodo() {
    let uid = request.auth.uid;

    let hasValidTimestamp = request.time == request.resource.data.createdAt;

    return belongsTo(uid) && hasValidTimestamp;
}
```

<h2> Read Other Documents </h2>

<h3> GET / EXISTS </h1>

NOTEs: It is wise to check if a user is logged in before performing get functions.

Argument: Takes a path to somewhere else in the database.

exists: Tells you if the document exists in the database,<br>
get: returns a payload of the specified doc
```
get(/databases/$(database)/documents/users/$(request.auth.uid)) <br>
exists(/databases/$(database)/documents/users/$(SOME_DOC_ID))
```

<h2> Role Base User Authentication </h2>

firestore.rules
```javascript
service cloud.firestore {
    match /databases/{database}/documents {
        match /users/{userId} {
            allow read: if isSignedIn()
            allow update, delete: if hasAnyRole(['admin'])
        }
    }
    
    match /posts/{postId} {
        allow read: if ( isSignedIn() && resource.data.published ) || hasAnyRole(['admin']);
        allow create: if isValidNewPost() && hasAnyRole(['author'])
        allow update: if isValidUpdatedPost() && hasAnyRole(['author', 'editor', 'admin'])
        allow delete: if hasAnyRole(['admin'])
    }

    function isSignedIn() {
        return request.auth != null;
    }

    function hasAnyRole(roles) {
        return isSignedIn() 
                && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(roles)
    }

    function isValidNewPost() {
        let post = request.resource.data;
        let isOwner = post.uid == request.auth.uid;
        let isNow = request.time == request.resource.data.createdAt;
        let hasRequiredFields = post.keys().hasAll(['content','uid','createdAt', 'published'])

        return isOwner && hasRequiredFields && isNow;
    }

    function isValidUpdatedPost() {
        let post = request.resource.data;
        let hasRequiredFields = post.keys().hasAny(['content','updatedAt', 'published'])
        let isValidContent = post.content is string && post.content.size() < 5000;

        return hasRequiredFields && isValidContent
    }
}
```

<h1> Unit Testing </h1>

Jeff Highly recommends putting in the effort to learn unit testing.

<h1> Sub-Lesson: Rate Limiting </h1>

Rate limiting is the process of blocking access to resources after a certain threshold has been reached. Firestore bills based on the quantity of reads and writes, but does not currently provide a way to block IPs or set explicit rate limits with Secutiy Rules. So how do you prevent a DDoS attack or a disgruntled user from spamming the app with unnecessary records?.

The following examples are based on an app that needs to...

- Limit users to 5 documents,
- Limit users to 1 new document per minute.

Firestore can achieve these security requirements by combining a batch write with getAfter, a new feature available in firestore security rules. The following examples use this technique to ensure a user cannot manipulate a count beyond a certain theshold or time contraint.

existsAfter()
getAfter() 

<h3>Scenario:</h3> 
A user is limited to 5 projects per account. Imagine a SaaS project-management 
app that expects to increase limits through paid accounts.<br>

<h3>Data Model:</h3>
2 Documents

```
users(parent document) {
    projects(child document) {
        projectA
    }
}
```

The user document keeps a registry of the projects as a Map of timestamps. This makes it possible to validate that multiple documents ar epart of the same batch write.

// users/{userId}
```
projects {
    projectA: Timestamp
    projectB: Timestamp
}
```

// users/{userId}/projects/{projectId} 

```
createdAt: Timestamp;
```

<h3>Example ./batch.js</h3>

```javascript
const batch = db.batch();
const timestamp = firebase.firestore.FieldValue.serverTimestamp.

const userRef = db.collection('users').doc(uid);
const projectRef = userRef.collection('projects').doc();

batch.set(projectRef, {...yourData, createdAt: timestamp()})

batch.set(userRef, {
    projects: {
        [projectRef.id]: timestamp()
    }
}, {merge: true});

batch.commit()
```
<h2> Security Rules </h2>

The Rules below validate the rate limit in 3 steps.

getAfter is a relatively new function that gets projected contents of a document after the batch write is finished, as if the current write has succeeded.

1. Validate Ownership of the document based on the auth UID.

2. Validate the new projectId is registered on the parent user doc with a matching timestamp. Without this step, the user could potentially add a new doc while bypassing the update parent document rule.

3. Validate the rate limit by measuring the length of keys in the map.

<h3> Example firestore.rules </h3>

```javascript
match /users/{uid}/projects{docId} {
    allow create: if

    // 1. validate ownership
    request.auth.uid == uid

    &&

    // 2. Validate both docs had matching timestamps for the documentId
    getAfter(
        /databases/$(database)/documents/users/$(uid)
    ).data.projects[docId] == request.resource.createdAt

    &&

    // 3. Validate Rate limit  
    getAfter(
        /databases/$(database)/documents/users/$(uid)
    ).data.projects.keys().size() <= 5
}

match /users/{uid} {
    allow update: if

    // 1. Validate Key cannot be changed.
    resource.data.projects.keys().hasAny( request.resource.data.projects.keys()  ) == false
}

```

<h2> Rate Limit By Time </h2>

<h3>Scenario:</h3>
Imagine we have a commenting system. The user should be limited to creating one comment per minute.

<h3>Data Model:</h3>

users/{userId}

```
lastComment: Timestamp;
```

posts/{postId}/comments/{commentId}
```
createAt: Timestamp;
```

<h3> Example ./batch.js </h3>

```javascript
const batch = db.batch()
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

const userRef = db.collection('users').doc(uid);
const commentRef = db.collection('posts').doc(id).collection('comments')

batch.update(userRef, { lastComment: timestamp() })
batch.set(commentRef, { createdAt: timestamp() })

batch.commit()
```

<h2> Security Rules </h2>

Firestore provides a global *duration* function that can calculate the range between two timestamps. The rule below substracts 1 minute from the request time, then compares it to the last comment t imestamp. Notice how the firs tvalidation uses get, but the second uses getAfter - we need the data before the change is committed when checking duration.

<h3> Example firestore.rules </h3>

```javascript
match posts/{postId}/comments/{commentId} {
    allow create: if

        // 1. Validate at least one minute has passed.
        get(
            /databases/$(database/documents/users/$(uid)
        ).data.lastComment < (request.time - duration.value(1, 'm'))

        &&

        // 2. Validate matching timestamps after operation
        getAfter(
            /databases/$(database)/documents/users/$(uid)
        ).data.lastComment == request.resource.createdAt

}
```

<h2> IP Address Rate Limiting </h2>

It is of course possible to enfource IP restrictions on the server. If this is a critical feature, you can bypass the Firebase SDK and implement your own custom IP adress security (https://firebase.google.com/docs/auth/admin/manage-sessions#advanced_security_enforce_ip_address_restrictions) logic in a cloud function. You will lose the ability to enforce regular firestore security rules nd not be able to perform realtime updates, but you gain full control over the security implementation.