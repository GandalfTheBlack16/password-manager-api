export class EmailContent {
  private readonly value: string
  private readonly isHtml: boolean

  constructor (value: string) {
    this.isHtml = this.isHtmlContent(value)
    this.value = value
  }

  get getValue (): string {
    return this.value
  }

  get getIsHtml (): boolean {
    return this.isHtml
  }

  private isHtmlContent (contet: string) {
    const regex = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/
    return regex.test(contet)
  }
}
