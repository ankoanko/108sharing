const Cable = ActionCable.createConsumer()

interface IChannel {
  channel: string
  [key: string]: any
}

interface IMixin {
  connected?(): void
  disconnected?(): void
  received?(obj: any): void
}

export const create = (channel: IChannel, mixin: IMixin = {}) =>
  Cable.subscriptions.create(channel, {
    connected(): void {
      // console.info('connected')
      if (typeof mixin.connected === 'function') {
        mixin.connected()
      }
    },
    disconnected(): void {
      // console.info('disconnected')
      if (typeof mixin.disconnected === 'function') {
        mixin.disconnected()
      }
    },
    received(data: any): any {
      // console.log('received')
      if (typeof mixin.received === 'function') {
        mixin.received(data)
      }
    },
  })
