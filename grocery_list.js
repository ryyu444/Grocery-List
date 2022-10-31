// Displayed input form for user
const form = document.querySelector('.grocery-form');
const alert = document.querySelector('.alert');

// Grabs User Input: Grocery item 
const grocery = document.getElementById('grocery');

// Actual form that stores user input
const groceryContainer = document.querySelector('.grocery-container')
const groceryList = document.querySelector('.grocery-list')

// Submit & Clear Buttons
const submitBtn = document.querySelector('.submit-btn')
const clearBtn = document.querySelector('.clear-btn')

// Edit Button: Stores element for editing, grabs id, & checks if editFlag is true for editing
let editElement;
let editFlag = false;
let editID = "";

// Event Listeners: Submit form & Clear values
// Delete & Edit buttons CANNOT be initially accessed till an item is added
form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);

// Load grocery-items
window.addEventListener('DOMContentLoaded', setupItems);

// Functions: Add Item, display Alert, Resetting form display, & Adding to local storage
function addItem(event) {
    event.preventDefault(); // Stops default action from occurring if event is not explicitly handled
    // Grabs item value & creates a unique id
    const value = grocery.value;
    const id = new Date().getTime().toString();
    
    // 1) Add Item
    if (value && !editFlag) {
        // Creates new grocery-item
        createListItem(id, value);

        // Display alert for success
        displayAlert(`${value} has been added to the list`, "success");
        
        // Show container for the new grocery-item
        groceryContainer.classList.add("show-container");
        
        // Add to local storage
        addToLocalStorage(id, value);
    
        // Set display back to default
        setBackToDefault();
    } 

    // 2) Editing list
    else if (value && editFlag) {
        // Stores previous item html
        const prev_val = editElement.innerHTML;
        
        // If new inputted value is different, change the element & edit it in local storage
        if (prev_val !== value) {
            editElement.innerHTML = value;
            displayAlert(`${prev_val} has been changed to ${value}`, 'success');
            
            // Edit local storage
            editLocalStorage(editID, value);
        }

        // Otherwise, input is the same & output an error
        else {
            displayAlert(`No edits have been made`, "danger");
        }
        
        // Resets user display back to default
        setBackToDefault();
    } 
    
    // 3) Adding empty string
    else {
        displayAlert("Please enter an item", "danger");
    }
}

// Display Alert: Text + Success/Error
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    
    // remove alert - Set timeout by replacing the alert text & removing the class + setting time
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`); }, 2000);
}

// Delete function: Accessses grocery-item & then removes it from grocery-list
function deleteItem(event) {
    // Grabs grocery-item parent container (button --> btn-container --> grocery-item)
    const grocery_item_element = event.currentTarget.parentElement.parentElement;
    // Grabs the name of the grocery-item & id
    const grocery_name = grocery_item_element.firstChild.innerHTML;
    const grocery_id = grocery_item_element.dataset.id;
    // Removes grocery-item from grocery-list
    groceryList.removeChild(grocery_item_element);

    // If grocery-list has no grocery-item children, do not show container (remove the class)
    if (groceryList.children.length === 0) {
        groceryContainer.classList.remove('show-container');
    }

    // Displays alert that item has been removed & resets display to default
    displayAlert(`${grocery_name} has been removed`, "success");
    
    // Remove from local storage
    removeFromLocalStorage(grocery_id);
    
    // Sets interface back to default
    setBackToDefault();
    
}

// Edit function
function editItem(event) {
    // Accesses grocery-item parent container
    const grocery_item_element = event.currentTarget.parentElement.parentElement;
    
    // Set edit item (Grabs <p class = "title"> name </p> element)
    editElement = event.currentTarget.parentElement.previousElementSibling;
    
    // Set form value (Grabs name from <p> element & puts into input box)
    // Sets editFlag to true & sets editId to the cur grocery-item id
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = grocery_item_element.dataset.id;
    submitBtn.textContent = "edit";
}

// Clear items: Grabs grocery item class
function clearItems() {
    // Grabs all grocery-item class items
    const items = document.querySelectorAll('.grocery-item');

    // Goes through grocery items if there is more than one item
    if (items.length > 0) {
        // Selects each grocery item
        items.forEach(function (item) {
            // Parent: list = grocery-list
            // item.forEach(each entry in grocery-item) -> Remove child entry from grocery-list
            groceryList.removeChild(item);
        });
    }
    // Removes the displayed list & shows alert
    groceryContainer.classList.remove('show-container');
    displayAlert('Cleared List', 'success');

    // Remove grocery items from local storage
    localStorage.removeItem('grocery_list');

    // Resets to default: so display won't show incorrectly
    setBackToDefault();
}

// Set back to default: Resets input item, editFlag, editID, & submit button text
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// Local Storage API: NOTE - SAVE AS STRINGS!!!

// setItem: localStorage.setItem("thing", JSON.stringify(['item1', 'item2']));
// getItem: const var = JSON.parse(localStorage.getItem("thing"));
// removeItem: localStorage.removeItem("thing");

// Add grocery-item to local storage
function addToLocalStorage(id, value) {
    const grocery_item = {id:id, value:value}; // Can remove :id & :value if property == passed parameters
    
    // Grab grocery list of parsed grocery-item objects or empty array (NULL if getItem fails --> [])
    let grocery_items = getLocalStorage();

    // Adds grocery item to grocery list & update local storage of grocery list
    grocery_items.push(grocery_item);
    localStorage.setItem('grocery_list', JSON.stringify(grocery_items));
}

// Remove grocery-item from local storage
function removeFromLocalStorage(id) {
    let grocery_items = getLocalStorage();
    
    // Grabbing values that don't match id
    // Returns them so the new array won't have the given id
    grocery_items = grocery_items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });

    // Updates grocery_list with the new grocery items
    localStorage.setItem('grocery_list', JSON.stringify(grocery_items));
}

// Edit a grocery-item in local storage
function editLocalStorage(id, value) {
    let grocery_items = getLocalStorage();

    // Remaps key-value pairs if a value changed is specified, else return the item object
    grocery_items = grocery_items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });

    // Updates grocery_list with new grocery items
    localStorage.setItem("grocery_list", JSON.stringify(grocery_items));
}

// Grabs grocery-list
function getLocalStorage() {
    // Returns grocery_list array of objects or empty array
    return localStorage.getItem("grocery_list") ? 
           JSON.parse(localStorage.getItem('grocery_list')) : [];
}

// Setup Items on website load
function setupItems() {
    let grocery_items = getLocalStorage();

    // Goes through grocery item in local storage & creates a new grocery-item to display
    if (grocery_items.length > 0) {
        grocery_items.forEach(function (item) {
            createListItem(item.id, item.value);
        })
    }

    // Displays grocery-list
    groceryContainer.classList.add('show-container');
}

function createListItem(id, value) {
        // Creates element of article type
        const grocery_element = document.createElement('article');
    
        // Add class of grocery-item to element
        grocery_element.classList.add('grocery-item');
        
        // Add id to the attribute & set attribute to element
        const attr = document.createAttribute('data-id');
        attr.value = id;
        grocery_element.setAttributeNode(attr);
        
        // Add HTML: Creates each individual grocery item w/ edit & delete button
        grocery_element.innerHTML = `<p class="title">${value}</p>
                                    <div class="btn-container">
                                        <!-- Edit Button -->
                                        <button type="button" class="edit-btn">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <!--  Button -->
                                        <button type="button" class="delete-btn">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>`;
        // We have access to edit & delete button afterwards here
        const deleteBtn = grocery_element.querySelector('.delete-btn');
        const editBtn = grocery_element.querySelector('.edit-btn');
        
        // Add event handlers to delete & edit buttons
        deleteBtn.addEventListener('click', deleteItem);
        editBtn.addEventListener('click', editItem);

        // Append child to groceryList to add the new element
        groceryList.appendChild(grocery_element);
}