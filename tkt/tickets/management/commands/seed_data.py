import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from tickets.models import Ticket

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with demo data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        # 1. Create Demo User
        demo_email = 'demo@example.com'
        demo_password = 'password123'
        
        if not User.objects.filter(email=demo_email).exists():
            user = User.objects.create_user(
                email=demo_email,
                password=demo_password,
                full_name='Demo User',
                role='AG', # Agent role
                is_staff=True
            )
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully created demo user: {demo_email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Demo user {demo_email} already exists'))

        demo_user = User.objects.get(email=demo_email)

        # 2. Create some more users (Agents and Regular)
        agents = []
        regular_users = []

        agent_data = [
            ('alice@example.com', 'Alice Agent'),
            ('bob@example.com', 'Bob Builder'),
        ]

        for email, name in agent_data:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={'full_name': name, 'role': 'AG', 'is_staff': True}
            )
            if created:
                user.set_password('password123')
                user.save()
            agents.append(user)

        user_data = [
            ('charlie@example.com', 'Charlie Customer'),
            ('david@example.com', 'David Doe'),
        ]

        for email, name in user_data:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={'full_name': name, 'role': 'US'}
            )
            if created:
                user.set_password('password123')
                user.save()
            regular_users.append(user)

        # 3. Create Tickets
        ticket_titles = [
            'System login failure',
            'Cannot reset password',
            'UI bug on dashboard',
            'Request for new feature',
            'Slow performance in reports',
            'Missing data in exports',
            'API connection timeout',
            'Mobile app crashing',
            'Email notifications not working',
            'Update documentation for v2'
        ]

        statuses = ['open', 'in_progress', 'resolved', 'closed']
        priorities = ['low', 'medium', 'high']

        for i, title in enumerate(ticket_titles):
            Ticket.objects.get_or_create(
                title=title,
                defaults={
                    'description': f'Detailed description for {title}. This is a seeded ticket for demonstration purposes.',
                    'status': random.choice(statuses),
                    'priority': random.choice(priorities),
                    'created_by': random.choice(regular_users + agents),
                    'assigned_to': random.choice(agents) if random.random() > 0.3 else None
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded tickets and users!'))
