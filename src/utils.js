const axios = require('axios')
const { globalApiKey, disabledCallbacks } = require('./config')

// Trigger webhook endpoint
const triggerWebhook = async (webhookURL, sessionId, dataType, data) => {
  try {
    console.log('[WEBHOOK] Sending webhook...')
    console.log('[WEBHOOK] URL:', webhookURL)
    console.log('[WEBHOOK] Payload:', { sessionId, dataType, data: JSON.stringify(data) })

    const response = await axios.post(
      webhookURL,
      { dataType, data, sessionId },
      {
        headers: {
          'x-api-key': globalApiKey
        }
      }
    )

    console.log('[WEBHOOK] Success')
    console.log('[WEBHOOK] Status:', response.status)
    console.log('[WEBHOOK] Response:', response.data)
  } catch (error) {
    console.log('[WEBHOOK] Failed to send webhook')

    if (error instanceof Error) {
      console.log('[WEBHOOK] Error Name:', error.name)
      console.log('[WEBHOOK] Error Message:', error.message)
      console.log('[WEBHOOK] Stack:', error.stack)
    } else {
      console.log('[WEBHOOK] Unknown Error:', error)
    }

    if (error.response) {
      console.log('[WEBHOOK] Response Status:', error.response.status)
      console.log('[WEBHOOK] Response Data:', error.response.data)
    } else {
      console.log('[WEBHOOK] Error Config:', error.config)
    }
  }
}

// Function to send a response with error status and message
const sendErrorResponse = (res, _status, message) => {
  res.status(200).json({ success: false, error: message })
}

// Function to wait for a specific item not to be null
const waitForNestedObject = (rootObj, nestedPath, maxWaitTime = 10000, interval = 100) => {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const checkObject = () => {
      const nestedObj = nestedPath.split('.').reduce((obj, key) => obj ? obj[key] : undefined, rootObj)
      if (nestedObj) {
        // Nested object exists, resolve the promise
        resolve()
      } else if (Date.now() - start > maxWaitTime) {
        // Maximum wait time exceeded, reject the promise
        console.log('Timed out waiting for nested object')
        reject(new Error('Timeout waiting for nested object'))
      } else {
        // Nested object not yet created, continue waiting
        setTimeout(checkObject, interval)
      }
    }
    checkObject()
  })
}

const checkIfEventisEnabled = (event) => {
  return new Promise((resolve, reject) => { if (!disabledCallbacks.includes(event)) { resolve() } })
}

module.exports = {
  triggerWebhook,
  sendErrorResponse,
  waitForNestedObject,
  checkIfEventisEnabled
}
