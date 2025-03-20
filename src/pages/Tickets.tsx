
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, Calendar, Clock, Users } from 'lucide-react';

interface TicketEvent {
  id: string;
  title: string;
  creator: string;
  creatorHandle: string;
  date: string;
  time: string;
  attendees: number;
  maxAttendees: number;
  price: number;
  image: string;
  tokenGated: boolean;
  status: 'upcoming' | 'live' | 'ended';
}

const mockEvents: TicketEvent[] = [
  {
    id: '1',
    title: 'NFT Masterclass: Creating Digital Art',
    creator: 'CryptoArtist',
    creatorHandle: 'cryptoartist',
    date: 'June 15, 2023',
    time: '2:00 PM EST',
    attendees: 128,
    maxAttendees: 200,
    price: 15,
    image: '/placeholder.svg',
    tokenGated: true,
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Web3 Development Workshop',
    creator: 'BlockchainDev',
    creatorHandle: 'blockchaindev',
    date: 'June 18, 2023',
    time: '1:00 PM EST',
    attendees: 75,
    maxAttendees: 150,
    price: 20,
    image: '/placeholder.svg',
    tokenGated: false,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Crypto Trading Strategies',
    creator: 'TokenTrader',
    creatorHandle: 'tokentrader',
    date: 'June 10, 2023',
    time: '3:30 PM EST',
    attendees: 200,
    maxAttendees: 200,
    price: 25,
    image: '/placeholder.svg',
    tokenGated: true,
    status: 'ended'
  },
  {
    id: '4',
    title: 'Music NFT Launch Party',
    creator: 'AudioCreator',
    creatorHandle: 'audiocreator',
    date: 'June 12, 2023',
    time: '8:00 PM EST',
    attendees: 45,
    maxAttendees: 100,
    price: 10,
    image: '/placeholder.svg',
    tokenGated: false,
    status: 'live'
  }
];

const TicketCard: React.FC<{ event: TicketEvent }> = ({ event }) => {
  const getStatusBadge = () => {
    switch (event.status) {
      case 'live':
        return <span className="bg-green-500 text-white text-xs py-1 px-2 rounded-full">Live Now</span>;
      case 'upcoming':
        return <span className="bg-blue-500 text-white text-xs py-1 px-2 rounded-full">Upcoming</span>;
      case 'ended':
        return <span className="bg-gray-500 text-white text-xs py-1 px-2 rounded-full">Ended</span>;
    }
  };

  const isAvailable = event.status !== 'ended' && event.attendees < event.maxAttendees;

  return (
    <div className="glass-card overflow-hidden hover-scale">
      <div className="h-40 relative">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
          {getStatusBadge()}
        </div>
        {event.tokenGated && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs py-1 px-2 rounded-full flex items-center">
            <Ticket className="h-3 w-3 mr-1" />
            Token Gated
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-orbitron text-lg font-medium mb-1">{event.title}</h3>
        <p className="text-sm text-gray-400 mb-3">by @{event.creatorHandle}</p>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.attendees}/{event.maxAttendees} Attendees</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className="font-orbitron text-lg font-medium">${event.price}</p>
          <Button 
            className={isAvailable ? "bg-white text-black hover:bg-white/90" : "bg-gray-700 text-gray-300 cursor-not-allowed"}
            disabled={!isAvailable}
          >
            {isAvailable ? "Buy Ticket" : "Sold Out"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Tickets: React.FC = () => {
  return (
    <Layout>
      <div className="py-4">
        <div className="glass-card p-6 mb-6">
          <h1 className="text-2xl font-orbitron font-bold mb-2 text-glow">Event Tickets</h1>
          <p className="text-gray-400">Discover and purchase tickets for exclusive creator events</p>
        </div>
        
        <Tabs defaultValue="all">
          <div className="mb-6">
            <TabsList className="glass w-full justify-start p-1">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Ticket className="h-4 w-4" />
                <span>All Events</span>
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-1">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <span>Live Now</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Upcoming</span>
              </TabsTrigger>
              <TabsTrigger value="my-tickets" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>My Tickets</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockEvents.map(event => (
                <TicketCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="live" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockEvents.filter(e => e.status === 'live').map(event => (
                <TicketCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockEvents.filter(e => e.status === 'upcoming').map(event => (
                <TicketCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="my-tickets" className="mt-0">
            <div className="glass-card p-6 text-center">
              <div className="py-12 flex flex-col items-center">
                <Ticket className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-orbitron mb-2">No Tickets Yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  You haven't purchased any event tickets yet. Browse upcoming events to find something interesting!
                </p>
                <Button className="bg-white text-black hover:bg-white/90">
                  Explore Events
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Tickets;
