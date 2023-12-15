// header nav
function scrollHeader() {
    const header = document.getElementById('header');
    if (this.scrollY >= 80) header.classList.add('scroll-header');
    else header.classList.remove('scroll-header');
}

window.addEventListener('scroll', scrollHeader);

// about tabs
const tabs = document.querySelectorAll('[data-target]');
const tabContents = document.querySelectorAll('[data-content]');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target);

        Array.from(tabContents).forEach((tabContent) => {
            tabContent.classList.remove('tab__active');
        });

        if (target) {
            target.classList.add('tab__active');      
        }

        tabs.forEach((tab) => {
            tab.classList.remove('tab__active');
        });

        tab.classList.add('tab__active');
    });
});

// skills tabs
const tabsSkills = document.querySelectorAll('[data-target]');
const tabContentSkills = document.querySelectorAll('[data-content]');

tabsSkills.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target);

        tabContentSkills.forEach(tabContents => {
            tabContents.classList.remove('skills__active');
        });

        target.classList.add('skills__active');

        tabsSkills.forEach(tab => {
            tab.classList.remove('skills__active');
        });
        tab.classList.add('skills__active');
    });
})


// mixitup filter port
document.addEventListener('DOMContentLoaded', function () {
        
    const mixerPortfolio = mixitup('.work__container', {
        selectors: {
            target: '.work__card'
        },
        animation: {
            duration: 300
        }
    });

    const linkWork = document.querySelectorAll('.work__item');

    function activeWork() {
        linkWork.forEach(l => l.classList.remove('active-work'));
        this.classList.add('active-work');

        const category = this.dataset.filter;

        mixerPortfolio.filter(category);
    }

    linkWork.forEach(l => l.addEventListener('click', activeWork));

});

// work popup
document.addEventListener('click', (e) => {
    if(e.target.classList.contains('work__button')) {
        togglePortfolioPopup();
        portfolioItemDetails(e.target.parentElement);
    }
});

function togglePortfolioPopup() {
    document.querySelector('.portfolio__popup').classList.toggle('open');
};

document.querySelector('.portfolio__popup-close').addEventListener('click', togglePortfolioPopup);

function portfolioItemDetails(portfolioItem) {
    document.querySelector('.pp__thumbnail img').src = portfolioItem.querySelector('.work__img').src;
    document.querySelector('.portfolio__popup-subtitle span').innerHTML = portfolioItem.querySelector('.work__title').innerHTML;
    document.querySelector('.portfolio__popup-body').innerHTML = portfolioItem.querySelector('.portfolio__item-details').innerHTML;
}

// services modal
const modalViews = document.querySelectorAll('.services__modal');
const modalBtns = document.querySelectorAll('.services__button');
const modalCloses = document.querySelectorAll('.services__modal-close');

let modal = function (modalClick) {
    modalViews[modalClick].classList.add('active-modal');
};

modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click', () => {
        modal(i);
    });
});

modalCloses.forEach((modalClose) => {
    modalClose.addEventListener('click', () => {
        modalViews.forEach((modalView) => { 
            modalView.classList.remove('active-modal');
        });
    });
});

// contact
const contactForm = document.getElementById('contact-form'),
    contactName = document.getElementById('contact-name'),
    contactEmail = document.getElementById('contact-email'),
    contactSubject = document.getElementById('contact-subject'),
    contactMessage = document.getElementById('contact-message'),
    errorMessage = document.getElementById('error-message');

const sendEmail = (e) => {
    e.preventDefault();
    // check if the field is not empty
    if (
        contactName.value === '' ||
        contactEmail.value === '' ||
        contactSubject.value === '' ||
        contactMessage.value === ''
    ){
        // show mess
        errorMessage.textContent = 'Fill all the input fields';
    }
    else {
        //serviceId - templateId - #form - piblickey
        emailjs.sendForm('service_phvvtyi', 
        'template_gwykp7x', 
        '#contact-form', 
        'zYEQLgHId3NW_zGO-')
        .then(() => {
            // show message and add color , window + dot to open emoji
            errorMessage.classList.add('color-first');
            errorMessage.textContent = 'Message sent ✔️';
            //remove mess after 5s
            setTimeout(() => {
                errorMessage.textContent = '';
            }, 5000);
        }, (error) => {
            alert('OOPs: something went wrong...', error);
        });
        //clear input fields
        contactName.value = '';
        contactEmail.value = '';
        contactSubject.value = '';
        contactMessage.value = '';
    }
};

contactForm.addEventListener('submit', sendEmail);