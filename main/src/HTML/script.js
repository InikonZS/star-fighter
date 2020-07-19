/*Header*/
const MENU = document.getElementById('menu');



/*Header*/
MENU.addEventListener("click", (event) => {
    MENU.querySelectorAll("a").forEach(el => el.classList.remove("active"));
    event.target.classList.add("active");
});

/*Scroll*/
document.addEventListener('scroll', onScroll);

function onScroll() {
    const curPos = (window.scrollY +90);
    const divs = document.querySelectorAll('section, body');
    const links = document.querySelectorAll('a');

    divs.forEach((el) => {
        if (el.offsetTop <= curPos && (el.offsetTop + el.offsetHeight) > curPos) {
            links.forEach((a) => {
                a.classList.remove('active');
                if (el.getAttribute('id') === a.getAttribute('href').substring(1)) {
                    a.classList.add('active');
                }
            })
        }
    })
}


//Scroll smooth
const scrolls = document.querySelectorAll('a[href*="#"]')

for (let scroll of scrolls) {
    scroll.addEventListener('click', function (event) {
        event.preventDefault();
        const blockID = scroll.getAttribute('href')
        document.querySelector('' + blockID).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    })
}

/*Hamburger*/ 
const HAMBURGER = (event) => {
    const burger = document.querySelector('.burger');
    const burger2 = document.querySelector('.hamburger');
    const background = document.querySelector('.navigation__burger'); 
    const nav = document.querySelector('.nav__links');
    const title = document.querySelectorAll('.hamburger__title');
    burger.addEventListener('click', (event) => {
        nav.classList.toggle('nav__active');
        document.getElementById('hidden__title').classList.toggle('hidden__title');
        burger2.classList.toggle('hamburger__rotate');
        background.classList.toggle('hamburger__background');
     
        title.forEach(el => {
            el.style.animation = 'navLinkFade 1.3s ease forwards'
        });
    });  
};

HAMBURGER();