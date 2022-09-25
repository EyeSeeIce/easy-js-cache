Javascript Easy Cache
=====================

**easy-js-cache** will allow you to cache data locally. It is very convenient to save data from the API so as not to repeat requests.

---

*<span style="color:#ff6262">Package in development process</span>*

---

installation
============

> npm install easy-js-cache

Feature list:
=============

* Cache any type of data
* Lifetime of cache
* Half types
* Panel to visualize cache

How to Use?
===========

Method List:

* configure(options)
* set(key, value, params)
* get(key)
* has(key)
* remove(key)
* destroy()
* keys()
* on(type, cb)

Types:


| Param                   | Type                                                     | Required | Default | Description                        |
| ----------------------- | -------------------------------------------------------- | -------- | ------- | ---------------------------------- |
| key                     | String                                                   | true     | null    | Key for cached value              |
| value                   | Any                                                      | true     | null    | Caching value                      |
| params.expireIn         | Number                                                   | optional | null    | Default lifetime for current cache |
| options.defaultExpireIn | Number                                                   | optional | 300000  | Default cache lifetime             |
| options.withCacheTools  | Boolean                                                  | optional | false   | Show panel with all cache          |
| type                    | String ('get', 'set',<br />'destroy' <br />or 'remove') | true     | null    | Event type                         |

Coding Example
--------------

### Basic usage

```typescript
import { cacheMachine } from 'js-easy-cache'

interface Client {
  readonly firstName: string,
  readonly lastName: string,
  readonly phone: string
}

const clientService = {

  getAllClients: () => {
    const key = 'allClients'
  
    //Checking if the cache exists
    if (cacheMachine.has(key)) {
      //Return cache if exist
      return cacheMachine.get<Client[]>(key)
    } else {
      //Make request
      const data = userService.getAll()
      //Set cache with 1 min lifetime
      cacheMachine.set(key, data, {
        expireIn: 60000
      })
    }
  },

  getOneClient: (uuid: string) => {
    const key = uuid
    if (cacheMachine.has(key)) {
      return cacheMachine.get<Client>(key)
    } else {
      return userService.get({ uuid })
    }
  }

}

```

### Configure

```typescript
//index.ts
import { cacheMachine } from 'js-easy-cache'
import 'easy-js-cache/dist/css/index.css'

cacheMachine.configure({
  withCacheTools: true,
  defaultExpireIn: 120000
})

...

```

In Progress
===========

* ⬜ Promises Method
* ✅ More events
* ⬜ Visualise events
* ⬜ Optimize methods
* ⬜ Sync with Browser Storage
* ⬜ Better cache visualise

---

**License**

MIT

---

Good coding and have fun
