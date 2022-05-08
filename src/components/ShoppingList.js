import React, { useEffect, useState } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);

  //fetch - add empty array so it only loads once on page load 
  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then((r) => r.json())
      .then((items) => setItems(items));
  }, []);

  // Since the ShoppingList component is a parent component to the ItemForm component, we'll need to pass a callback function as a prop so that the ItemForm component can send the new item up to the ShoppingList.
  function handleAddItem(newItem) {
    // For the last step, we need to call setState with a new array that has our new item at the end.
    setItems([...items, newItem]);
    //Now each time a user submits the form, a new item will be added to our database and will also be added to our client-side state, so that the user will immediately see their item in the list.
  }

  //add callback function to handle updated item 
  function handleUpdatedItem(updatedItem) {
    // As a last step, we need to call setState with a new array that replaces one item with the new updated item from the server. Recall from our lessons on working with arrays in state that we can use .map to help create this new array:
    const updatedItems = items.map((item) => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      } else {
        return item;
      }
    });
    setItems(updatedItems);
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;

    return item.category === selectedCategory;
  });

  // We'll pass a callback down from ShoppingList to Item (because we need to keep state in this component)
  function handleDeleteItem(deletedItem) {
    //all setState with a new array that removes the deleted item from the list. Recall from our lessons on working with arrays in state that we can use .filter to help create this new array:
    const updatedItems = items.filter((item) => item.id !== deletedItem.id);
    setItems(updatedItems);
  }

  return (
    <div className="ShoppingList">
      {/* add the onAddItem prop! */}
      <ItemForm on onAddItem={handleAddItem} />
      <Filter
        category={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          /* pass handleUpdatedItem and handleDeleteItem as a prop to Item */
          <Item 
            key={item.id} 
            item={item} 
            onUpdateItem={handleUpdatedItem} 
            onDeleteItem={handleDeleteItem} />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
