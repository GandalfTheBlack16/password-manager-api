import { Email } from '../../../src/send-email/domain/Email'
import { IllegalArgException } from '../../../src/shared/domain/exception/IllegalArgException'

describe('Email domain class', () => {

    it('should create an Email with non html content', () => {
        const email = new Email(['demo@email.com'], 'Demo subject', 'Demo content')
        expect(email).toBeDefined()
        expect(email.getRecipients.at(0)).toBe('demo@email.com')
        expect(email.isContentHtml).toBeFalsy()
    })

    it('should create an Email with html content', () => {
        const email = new Email(['demo@email.com'], 'Demo subject', '<h1>Demo content</h1>')
        expect(email).toBeDefined()
        expect(email.isContentHtml).toBeTruthy()
    })

    it('should skip invalid email addresses', () => {
        const email = new Email([
            'demo@email.com', 'fake', 'valid@email.com', 'invald', 'nice@email.com'
        ], 'Demo subject', '<h1>Demo content</h1>')
        expect(email).toBeDefined()
        expect(email.getRecipients.length).toBe(3)
        expect(email.getRecipients.includes('demo@email.com')).toBeTruthy()
        expect(email.getRecipients.includes('valid@email.com')).toBeTruthy()
        expect(email.getRecipients.includes('nice@email.com')).toBeTruthy()
    })

    it('should throw exeception is none address is valid', () => {
        let email;
        expect(() => {
            email = new Email([
                'thisshouldfail', 'invaldaddress'
            ], 'Demo subject', '<h1>Demo content</h1>')
        }).toThrow(IllegalArgException)

        expect(email).toBeUndefined()
    })
})