import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import './App.css'

function ContactForm({ onAddContact }) {
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')

  const handleChange = ({ target }) => {
    const { name, value } = target

    if (name === 'name') {
      setName(value)
    }

    if (name === 'number') {
      setNumber(value)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const isAdded = onAddContact({ name: name.trim(), number: number.trim() })

    if (isAdded) {
      setName('')
      setNumber('')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          pattern="\p{L}+(([' \-]\p{L}+)?\p{L}*)*"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          required
        />
      </label>

      <label>
        Number
        <input
          type="tel"
          name="number"
          value={number}
          onChange={handleChange}
          pattern="\+?\d{1,4}?[\-.\s]?\(?\d{1,3}?\)?[\-.\s]?\d{1,4}[\-.\s]?\d{1,4}[\-.\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          required
        />
      </label>

      <button type="submit">Add contact</button>
    </form>
  )
}

function Filter({ value, onChange }) {
  return (
    <label className="filter">
      Find contacts by name
      <input type="text" value={value} onChange={onChange} />
    </label>
  )
}

function ContactList({ contacts, onDeleteContact }) {
  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          contact={contact}
          onDeleteContact={onDeleteContact}
        />
      ))}
    </ul>
  )
}

function ContactItem({ contact, onDeleteContact }) {
  return (
    <li>
      <span>
        {contact.name}: {contact.number}
      </span>
      <button type="button" onClick={() => onDeleteContact(contact.id)}>
        Delete
      </button>
    </li>
  )
}

function App() {
  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem('contacts')

    return savedContacts
      ? JSON.parse(savedContacts)
      : [
          { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
          { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
          { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
          { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
        ]
  })
  const [filter, setFilter] = useState('')

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts))
  }, [contacts])

  const handleAddContact = ({ name, number }) => {
    const normalizedName = name.toLowerCase()
    const isDuplicate = contacts.some(
      (contact) => contact.name.toLowerCase() === normalizedName,
    )

    if (isDuplicate) {
      alert(`${name} is already in contacts.`)
      return false
    }

    setContacts((prevContacts) => [
      ...prevContacts,
      { id: nanoid(), name, number },
    ])

    return true
  }

  const handleFilterChange = ({ target }) => {
    setFilter(target.value)
  }

  const handleDeleteContact = (contactId) => {
    setContacts((prevContacts) =>
      prevContacts.filter((contact) => contact.id !== contactId),
    )
  }

  const normalizedFilter = filter.toLowerCase()
  const visibleContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(normalizedFilter),
  )

  return (
    <div className="app">
      <h1>Phonebook</h1>
      <ContactForm onAddContact={handleAddContact} />

      <h2>Contacts</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <ContactList
        contacts={visibleContacts}
        onDeleteContact={handleDeleteContact}
      />
    </div>
  )
}

export default App
