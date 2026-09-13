"use client";

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import './events.css';

import NavBar from './sections/NavBar';
import Hero from './sections/Hero';
import FirstVideo from './sections/FirstVideo';
import Jason from './sections/Jason';
import SecondVideo from './sections/SecondVideo';
import Lucia from './sections/Lucia';

import FirstVideo2 from './sections/FirstVideo2';
import Jason2 from './sections/Jason2';
import SecondVideo2 from './sections/SecondVideo2';
import Lucia2 from './sections/Lucia2';

import FirstVideo3 from './sections/FirstVideo3';
import Jason3 from './sections/Jason3';
import SecondVideo3 from './sections/SecondVideo3';
import Lucia3 from './sections/Lucia3';

import FirstVideo4 from './sections/FirstVideo4';
import Jason4 from './sections/Jason4';

import PostCard from './sections/PostCard';
import Final from './sections/Final';
import Outro from './sections/Outro';

gsap.registerPlugin(ScrollTrigger);

const EventsApp = () => {
  return (
    <main className="events-page">
      <NavBar />
      <Hero />

      <FirstVideo />
      <Jason />
      <SecondVideo />
      <Lucia />

      <FirstVideo2 />
      <Jason2 />
      <SecondVideo2 />
      <Lucia2 />

      <FirstVideo3 />
      <Jason3 />
      <SecondVideo3 />
      <Lucia3 />

      <FirstVideo4 />
      <Jason4 />

      <PostCard />
      <Final />
      <Outro />
    </main>
  )
}

export default EventsApp