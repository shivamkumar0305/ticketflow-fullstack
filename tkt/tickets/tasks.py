from celery import shared_task
import time 
from django.conf import settings
import resend

resend.api_key = settings.RESEND_API_KEY

@shared_task
def send_ticket_email_task(ticket_id, action_type, email):
    print(f"--- [CELERY] celery is sending an email for ticket {ticket_id}---")
    
    try :
        if action_type == 'created':
            subject = f"Ticket #{ticket_id} created"
            html_content = f"""
                <h1>We received your ticket!</h1>
                <p>Hi there, your support ticket <strong>#{ticket_id}</strong> has been created.</p>
                <p>Our team will look into it shortly.</p>
            """
        
        elif action_type == 'assigned':
            subject = f"Ticket #{ticket_id} assigned"
            html_content = f"""
                <h1>We received your ticket!</h1>
                <p>Hi there, you have been assigned ticket with id <strong>#{ticket_id}</strong></p>
                <p>Our team will look into it shortly.</p>
            """

        elif action_type == "resolved":
            subject = f"Ticket #{ticket_id} has been closed/resolved"
            html_content = f"""
                <h1>We received your ticket!</h1>
                <p>Hi there, your support ticket <strong>#{ticket_id}</strong> has been resolved.</p>
                <p>Our team will look into it shortly.</p>
            """
        else : 
            return "invalid action type"
        
        

        resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to":[email],
            "subject":subject,
            "html":html_content,
        })
        
        print(f"--- [CELERY] Email sucessfully sent to {email}: {subject} ---")
        return f"Email sent to {email}"
    except Exception as e :
        print(f"email failed: {e}")
        raise


