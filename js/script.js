//Constante que almavena el elemento con ID = 'BigImage'
const BigImage = document.getElementById('BigImage')

//Constante que almacena el elemento con ID = 'Image'
const Image = document.getElementById('Image')

//Constante que almacena los elemento de flechas y cerrar
const LeftArrow = document.getElementById('LeftArrow')
const RightArrow = document.getElementById('RightArrow')
const XClose = document.getElementById('XClose')

//Constante que almacena un arreglo con todas las imagenes en pequeno
/*La linea siguiente transforma cada elemento con class 'SmollImage' 
como un elemento de un arreglo*/
let SmallImage = [... document.querySelectorAll('.SmallImage')]

//Para mostrar u ocultar el boton de agregar 
let ImageDialogue = document.getElementById('Choose')

//Guardamos la posicion de la imagen a la que le damos click
let position = 0

//Recorrer todos los elemntos de un arreglo
SmallImage.forEach((elemento, i) => {
    //Para cada imagen, agrega un evento Click
    elemento.addEventListener('click', (e) => {
        position = i
        //Mostrar en el elemento Image de BigImage a la que se le da click

        BigImage.style.display = 'flex'
        Image.src = elemento.src
    })
});

//Se oculta la imagen al dar click sobre la x
XClose.addEventListener('click', (e) => {
    BigImage.style.display = 'none'
})

//se oculta la imagen al dar click alrededor de ella
BigImage.addEventListener('click', (e) => {
    if (e.target.classList.contains('BigImage'))
        BigImage.style.display = 'none'
})

RightArrow.addEventListener('click', (e) => {
    //Añadir clase fade-out a la imagen antes de cambiar
    Image.classList.add('fade-out')
    
    setTimeout(() => {
        position++
        if (position >= SmallImage.length){
            position = 0
        }
        Image.src = SmallImage[position].src
        Image.classList.remove('fade-out') //Elimina la clase para volver a mostrar
    }, 500)
})

LeftArrow.addEventListener('click', (e) => {
    // Añadir clase fade-out a la imagen antes de cambiar
    Image.classList.add('fade-out')
    
    setTimeout(() => {
        position--
        if (position < 0){
            position = SmallImage.length - 1
        }
        Image.src = SmallImage[position].src
        Image.classList.remove('fade-out') //Elimina la clase para volver a mostrar
    }, 500)
})

//Funcion que muestra el elemento input para seleccion de archivos
function ShowDialogue(){
    ImageDialogue.hidden = false
}
//agrega un evento para cuando se elije un archivo de imagen
ImageDialogue.addEventListener('change', (e) => {
    AddImage(e.target.files[0].name)
})

function AddImage(NameImage){
    const NewImage = 'res/images/' + NameImage
    const Container = document.getElementById('Gallery')

    //Crear el nuevo elemento de imagen
    const newImageElement = document.createElement('img')
    newImageElement.src = NewImage
    newImageElement.classList.add('SmallImage')
    newImageElement.draggable = true //Hacer que la imagen sea arrastrable

    //Añadir el nuevo elemento de imagen al contenedor
    Container.appendChild(newImageElement)

    //Asignar el evento de clic para seleccionar la imagen
    newImageElement.addEventListener('click', (e) => {
        if (SelectedImage === newImageElement) {
            SelectedImage.classList.remove('Selected')
            SelectedImage = null //Reiniciar la imagen seleccionada
        } else {
            if (SelectedImage){
                SelectedImage.classList.remove('Selected')
            }
            SelectedImage = newImageElement
            SelectedImage.classList.add('Selected') //Resaltar la imagen seleccionada

            position = SmallImage.indexOf(newImageElement)
            BigImage.style.display = 'flex'
            Image.src = newImageElement.src
        }
    })

    //Asignar los eventos de drag-and-drop a todas las imagenes de la galería
    function addDragAndDropEvents(imageElement){
        imageElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', SmallImage.indexOf(imageElement))
        })

        imageElement.addEventListener('dragover', (e) => {
            e.preventDefault();
        })

        imageElement.addEventListener('drop', (e) => {
            e.preventDefault()
            const draggedIndex = e.dataTransfer.getData('text/plain')
            const targetIndex = SmallImage.indexOf(imageElement)

            if (draggedIndex !== targetIndex && draggedIndex >= 0){
                const draggedElement = SmallImage[draggedIndex]
                if (draggedIndex < targetIndex){
                    Container.insertBefore(draggedElement, imageElement.nextSibling)
                } else {
                    Container.insertBefore(draggedElement, imageElement)
                }

                //Actualizar el arreglo SmallImage para reflejar el nuevo orden
                SmallImage = [...document.querySelectorAll('.SmallImage')]
            }
        })
    }

    //Aplicar los eventos de drag-and-drop a la nueva imagen y a todas las demás
    SmallImage = [...document.querySelectorAll('.SmallImage')]
    SmallImage.forEach(addDragAndDropEvents)

    ImageDialogue.hidden = true //Ocultar el diálogo de imagen
}

//Variable para almacenar la imagen seleccionada
let SelectedImage = null

function SelectAndDelete(){
    //Verificar si hay una imagen seleccionada
    if (SelectedImage){
        //Mostrar una alerta de confirmacion
        const confirmation = window.confirm("You want to delete this image?")
        
        //Si el usuario confirma, se elimina la imagen
        if (confirmation) {
            SelectedImage.remove()
            SelectedImage = null //Reiniciar la imagen seleccionada
        }
    } else {
        alert("Please, selec an image to delete.")
    }
}

//Funcion para agregar eventos a las imagenes pequenas
SmallImage.forEach((elemento, i) => {
    elemento.addEventListener('click', (e) => {
        //Si la imagen esta seleccionada, la deseleccionas
        if (SelectedImage === elemento){
            SelectedImage.classList.remove('Selected')
            SelectedImage = null //Resetea la imagen seleccionada
        } else {
            //Si hay una imagen seleccionada, la deseleccionas
            if (SelectedImage){
                SelectedImage.classList.remove('Selected')
            }
            //Selecciona la nueva imagen
            SelectedImage = elemento
            SelectedImage.classList.add('Selected') //Agrega clase para resaltar la imagen

            //Si no se quiere abrir BigImage, simplemente salimos de la función
            return //Salimos de la funcion, no abrimos BigImage
        }

        //Mostrar BigImage solo si no hay imagen seleccionada
        position = i //Guardamos la posición de la imagen clickeada
        BigImage.style.display = 'flex'
        Image.src = elemento.src
    })
})

//Variables para almacenar las posiciones de inicio y destino de arrastre
let draggedImage = null
let draggedIndex = null

//Agrega eventos de arrastre a cada imagen
SmallImage.forEach((image, index) => {
    image.addEventListener('dragstart', (e) => {
        draggedImage = image //Guarda la imagen que se esta arrastrando
        draggedIndex = index //Guarda el índice de la imagen arrastrada
        setTimeout(() => image.classList.add('hidden'), 0) //Esconde la imagen temporalmente
    })

    image.addEventListener('dragend', () => {
        draggedImage.classList.remove('hidden') //Muestra la imagen cuando se suelta
        draggedImage = null //Reinicia la variable
        draggedIndex = null //Reinicia el indice
    })

    image.addEventListener('dragover', (e) => {
        e.preventDefault() //Previene el comportamiento predeterminado para permitir el drop
    })

    image.addEventListener('drop', (e) => {
        e.preventDefault()
        
        const container = document.getElementById('Gallery')
        const dropIndex = SmallImage.indexOf(image)

        //Reorganizar las imagenes en el contenedor Gallery
        if (draggedImage && draggedIndex !== dropIndex){
            //Coloca la imagen antes o despues dependiendo de su posicion original
            if (draggedIndex < dropIndex){
                container.insertBefore(draggedImage, image.nextSibling)
            } else {
                container.insertBefore(draggedImage, image)
            }

            //Actualiza el arreglo de imágenes pequeñas
            SmallImage = [...document.querySelectorAll('.SmallImage')]
        }
    })
})

//Obtener el selector y el elemento de body
const themeSelector = document.getElementById('selector')
const body = document.body
// Variables para almacenar el tipo de transicion
let transitionType = 'fade'

//Funcion para cambiar el tema
function changeTheme(theme){
    body.classList.remove('theme-blue-yellow', 'theme-white-red', 'theme-black-grey')
    
    switch (theme) {
        case 'Ǝna': //Blue/Yellow
            body.classList.add('theme-blue-yellow')
            break;
        case 'BBQ': //White/Red
            body.classList.add('theme-white-red')
            break;
        case 'Hollow': //Black/Grey
            body.classList.add('theme-black-grey')
            break;
    }
}

//Evento para detectar cambios en el selector y aplicar el tema
themeSelector.addEventListener('change', (e) => {
    changeTheme(e.target.value)
})

changeTheme('Ǝna')
