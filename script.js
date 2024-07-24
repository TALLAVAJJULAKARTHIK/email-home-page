const emailData = {
    inbox: [
        { id: 1, to: "user1@example.com", subject: "Welcome to our service", message: "Thanks for signing up!", isRead: false },
        { id: 2, to: "user2@example.com", subject: "Order Confirmation", message: "Your order has been shipped.", isRead: false },
        { id: 3, to: "user3@example.com", subject: "Meeting Reminder", message: "Don't forget the meeting at 3 PM.", isRead: true }
    ],
    drafts: [
        { id: 4, to: "", subject: "Draft Email", message: "This is a draft." }
    ],
    sent: [
        { id: 5, to: "user4@example.com", subject: "Application Submitted", message: "We have received your application." }
    ],
    primary: [
        { id: 6, to: "user5@example.com", subject: "Primary Email 1", message: "Important update on your account." }
    ]
};

function showSection(sectionId) {
    document.querySelectorAll('.email-section').forEach(section => {
        section.classList.toggle('visible', section.id === sectionId);
    });
}

function displayEmails() {
    ['inbox', 'drafts', 'sent', 'primary'].forEach(sectionId => {
        const section = document.getElementById(sectionId);
        section.innerHTML = `<h2>${capitalize(sectionId)}</h2>`;
        emailData[sectionId].forEach(email => {
            const emailItem = document.createElement('div');
            emailItem.classList.add('email-item');
            emailItem.dataset.id = email.id;
            emailItem.innerHTML = `
                <strong>To:</strong> ${email.to}<br>
                <strong>Subject:</strong> ${email.subject}<br>
                <p>${email.message.slice(0, 50)}${email.message.length > 50 ? '...' : ''}</p>
                <div class="email-actions">
                    <button class="email-action-btn btn btn-info" onclick="markAsRead(${email.id}, '${sectionId}')">Mark as Read</button>
                    <button class="email-action-btn btn btn-danger" onclick="deleteEmail(${email.id})">Delete</button>
                    <button class="email-action-btn btn btn-warning" onclick="editEmail(${email.id}, '${sectionId}')">Edit</button>
                </div>
            `;
            section.appendChild(emailItem);
        });
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function toggleModal(modalId, action = 'show') {
    document.getElementById(modalId).classList.toggle('hidden', action === 'hide');
}

document.getElementById('composeButton').addEventListener('click', () => {
    toggleModal('composeModal');
});

document.getElementById('composeForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const toEmail = document.getElementById('toEmail').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    emailData.sent.push({ id: Date.now(), to: toEmail, subject, message });
    emailData.inbox.push({ id: Date.now(), to: toEmail, subject, message, isRead: false });

    document.getElementById('composeSuccessMessage').classList.remove('hidden');
    setTimeout(() => {
        toggleModal('composeModal', 'hide');
        displayEmails();
    }, 2000);
});

document.querySelector('.modal-content .close-btn').addEventListener('click', function () {
    toggleModal('editDraftModal', 'hide');
});

document.getElementById('editDraftForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const draftId = document.getElementById('editDraftId').value;
    const toEmail = document.getElementById('editToEmail').value.trim();
    const subject = document.getElementById('editSubject').value.trim();
    const message = document.getElementById('editMessage').value.trim();

    const draft = emailData.drafts.find(draft => draft.id == draftId);
    if (draft) {
        draft.to = toEmail;
        draft.subject = subject;
        draft.message = message;
        document.getElementById('editDraftSuccessMessage').classList.remove('hidden');
    }

    setTimeout(() => {
        toggleModal('editDraftModal', 'hide');
        displayEmails();
    }, 2000);
});

document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function () {
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        showSection(this.id.replace('Link', ''));
    });
});

function markAsRead(emailId, section) {
    const email = emailData[section].find(email => email.id === emailId);
    if (email) {
        email.isRead = true;
    }
    displayEmails();
}

function deleteEmail(emailId) {
    Object.keys(emailData).forEach(section => {
        emailData[section] = emailData[section].filter(email => email.id != emailId);
    });
    displayEmails();
}

function editEmail(id, section) {
    const email = emailData[section].find(email => email.id === id);
    document.getElementById('emailId').value = email.id;
    document.getElementById('toEmail').value = email.to;
    document.getElementById('subject').value = email.subject;
    document.getElementById('message').value = email.message;
    toggleModal('composeModal');
}

displayEmails();
