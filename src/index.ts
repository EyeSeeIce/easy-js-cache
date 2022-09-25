type Types = 'set' | 'get' | 'remove' | 'destroy'

function entries( obj: {[key: string]: any} ){
  let ownProps = Object.keys( obj ),
    i = ownProps.length,
    resArray = new Array(i);
  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]];

  return resArray;
};

class EventEmitter {
  events: any = {};

  constructor() {

  }

  subscribe(eventName: Types, fn: (message: string) => void) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(fn);

    return () => {
      this.events[eventName] = this.events[eventName].filter((eventFn: () => void) => fn !== eventFn);
    };
  }

  emit(eventName: Types, data: any) {
    const event = this.events[eventName];
    if (event) {
      event.forEach((fn: (data: any) => void) => {
        fn.call(null, data);
      });
    }
  }
}

let emitter = new EventEmitter();


const createTemplate = () => {
  return {
    template: `
      <div class='panel'>
        <div class='actions' style='color: #ff6262'>
          <div class='button'>
            ╼
          </div>
        </div>
        <div class='content'>
          
        </div>
      </div>
    `,
    content: 'content'
  }
};

class CacheStore {
  private defaultExpireIn: number = 300000;
  private withCacheTools: boolean = false;

  private cache: { [key: string]: any } = {};
  private time: { [key: string]: any } = {};

  private guiElement: HTMLElement | null = null
  private guiContentElement: HTMLElement | null = null


  configure(options: {
    defaultExpireIn?: number,
    withCacheTools?: boolean,
  }) {
    if (options.defaultExpireIn) {
      this.defaultExpireIn = options.defaultExpireIn;
    }

    if (options.withCacheTools) {
      this.withCacheTools = options.withCacheTools;
    }



    if (options.withCacheTools) {
      this.createGui()
      this.gui()
    }

  }

  set(key: string, value: any, params?: {
    expireIn?: number
  }) {
    this.cache[key] = value;

    this.time[key] = setTimeout(() => {
      delete this.cache[key];
      this.gui();
    }, params?.expireIn || this.defaultExpireIn);

    this.gui();
    emitter.emit('set', {
      message: 'Cache has been updated',
      time: new Date(),
      key,
      value: value
    });
  }

  get<T>(key: string): T {
    const value = this.cache[key]
    this.gui();

    emitter.emit('get', {
      message: 'Cache has been returned',
      time: new Date(),
      key,
      value: value,
    });
    return value
  }

  has(key: string): boolean {
    return this.cache.hasOwnProperty(key)
  }

  remove(key: string) {
    clearTimeout(this.time[key]);
    delete this.cache[key];
    delete this.time[key];
    this.gui();

    emitter.emit('remove', {
      message: 'Cache has been removed',
      time: new Date(),
      key,
      value: this.cache[key]
    });
  }

  destroy() {
    this.cache = {};
    this.time = {};
    this.gui();

    emitter.emit('destroy', {
      message: 'Cache has been destroyed',
      time: new Date(),
    });
  }

  keys(): string[] {
    return Object.keys(this.cache);
  }

  private  createGui() {
    const root = document.createElement('div')
    root.id = 'cache_id'

    root.innerHTML = createTemplate().template

    document.body.appendChild(root);

    this.guiContentElement = document.querySelector(`.${createTemplate().content}`)

    const hideButton = document.querySelector('.button')
    if (hideButton){
      hideButton.addEventListener('click', () => {
        if (this.guiContentElement) {
          this.guiContentElement.classList.toggle('hide')
        }
      })
    }

    this.guiElement = root

  }

  private gui() {

    if (this.withCacheTools && this.guiContentElement) {

      if (entries(this.cache).length === 0) {
        this.guiContentElement.innerHTML = '<div class="empty">Cache in empty</div>'
      } else {
        const content = entries(this.cache).map((c) => {
          return (
            `
          <div class='element'>
            <div>Key: ${c[0]}</div>
            <div>Value: ${JSON.stringify(c[1], null, 2)}</div>
          </div>
          `
          )
        })

        this.guiContentElement.innerHTML = content.join(' ')
      }

    }
  }

  on(type: Types, callback: (message?: string) => void) {
    emitter.subscribe(type, (message) => callback(message));
  }
}

export const cacheMachine = new CacheStore();


