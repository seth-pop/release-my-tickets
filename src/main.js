import { getQueryParam, postToGoogleSheets } from './helper'
import './style.css'
import Alpine from 'alpinejs'

const createTicket = (owner = '') => ({
  id:
    (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `ticket-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  url: '',
  details: '',
  service: '',
  verifier: owner || '',
  monitor: '',
})

window.ticketForm = () => ({
  appScriptUrl: getQueryParam('appScriptUrl'),
  sheetId: getQueryParam('sheetId'),
  sheetName: getQueryParam('sheetName'),
  owner: '',
  isSubmitting: false,
  tickets: [createTicket()],
  init() {
    if (typeof localStorage !== 'undefined') {
      const cachedOwner = localStorage.getItem('owner')
      if (cachedOwner) {
        this.owner = cachedOwner
        this.syncVerifiers(cachedOwner)
      }
      this.$watch('owner', (value, oldValue) => {
        localStorage.setItem('owner', value || '')
        this.syncVerifiers(value, oldValue)
      })
    }
    if (!this.appScriptUrl) {
      throw new Error('App script URL is required')
    }
    if (!this.sheetId) {
      throw new Error('Sheet ID is required')
    }
    if (!this.sheetName) {
      throw new Error('Sheet name is required')
    }
  },
  syncVerifiers(newOwner, prevOwner = '') {
    this.tickets.forEach((ticket) => {
      if (!ticket.verifier || ticket.verifier === prevOwner) {
        ticket.verifier = newOwner
      }
    })
  },
  addTicket() {
    this.tickets.push(createTicket(this.owner))
    this.$nextTick(() => {
      const inputs = this.$root.querySelectorAll('input[data-ticket-url]')
      const lastInput = inputs[inputs.length - 1]
      if (lastInput) {
        lastInput.focus()
      }
    })
  },
  removeTicket(index) {
    this.tickets.splice(index, 1)
  },
  getTicketsData() {
    return this.tickets.map((ticket) => ({
      ticketLink: ticket.url,
      ticketDescription: ticket.details,
      service: ticket.service,
      verifier: ticket.verifier,
      monitorLink: ticket.monitor,
      owner: this.owner,
    }))
  },
  async submit() {
    if (this.isSubmitting) return
    this.isSubmitting = true
    const ticketsData = this.getTicketsData()
    try {
      const responses = await Promise.all(
        ticketsData.map((row) => {
          const formBody = new URLSearchParams({
            sheetId: this.sheetId,
            sheetName: this.sheetName,
            ...row,
          })
          return postToGoogleSheets(this.appScriptUrl, formBody)
        })
      )

      if (responses.length !== ticketsData.length) {
        throw new Error('Failed to submit all tickets')
      } else if (responses.length == ticketsData.length){
        alert('Tickets submitted successfully')
      }
    } catch (error) {
      alert(`Failed to submit tickets: ${error.message}`)
    } finally {
      this.isSubmitting = false
    }
  },
})

Alpine.start()
