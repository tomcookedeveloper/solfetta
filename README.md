## Try it out

You can find Solfetta at [https://tomcooke.me/solfetta](https://tomcooke.me/solfetta).

## Introduction

Solfetta is a small, simple web app designed to make it convenient to practise playing by ear on your phone or tablet in a way that should strengthen your musical ear.

You can add Solfetta to your home screen like any other web page and this will give you a more app-like experience with more space used for the app and no browser controls appearing.

Solfetta is open source under the MIT license. It uses the [webaudio-tinysynth](https://github.com/g200kg/webaudio-tinysynth) library for its sounds.

Solfetta uses no cookies. Settings are stored using browser local storage.

### IMPORTANT NOTES:

1. Every so often you may find that the app goes silent. This appears to be unavoidable when working with Web Audio on iOS devices at least. You can reload your browser window to fix the problem or if you have added the app you can use Audio->Fix Audio in the Solfetta menu which will also cause the app to reload.
2. I've only been able to test on older Android devices so far and the latency (delay between pressing a button and hearing a note) was disappointing. I understand there have been improvements in this area so I'm hoping people with newer phones will have a better experience. This reflects WebAudio performance and there's not much I can do to improve it.
3. Unfortunately when playing with more than one finger at a time you may find that sometimes touches are missed, especially when playing notes near the edges of the screen. There doesn't seem to be much that can be done about this but please let me know if you know otherwise.
4. On older devices you may need to play at least one note using the note buttons before using the melody button in order to hear sound.

## Why I made this app

I have long dreamed of being able to play by ear without making mistakes and with effortless awareness of the notes being played and their musical function. I first tried using ear training software almost 25 years ago and have come back to it every now and again, without ever making all that much progress. Most recently, when my youngest reached school age and I began to have some more free time after a few very busy years it felt like a good time to have another try.

After a while it became clear that the options I had weren't really working for me. I didn't often have a good block of free time to sit down at an instrument at a time when it would have been acceptable to make noise, I was self-conscious about being overheard going through the trial-and-error process of figuring out music by ear anyway, and maintaining awareness of the notes being played was an effort I wasn't often prepared to make.

The obvious alternative was to use smartphone ear training apps which address all those problems and have the enticing advantage of being usable while sitting comfortably in bed. I clocked up a decent amount of time in a couple of popular apps which I found to be well made, good value and reasonably flexible, but the experience wasn't really what I wanted. The tracking of right and wrong answers made it feel pressured rather than relaxing, the sequences of random notes weren't really pleasant to listen to, and I found myself getting better at figuring out the right answers as opposed to developing an intuitive sense for them.

Eventually I decided that I wanted a smartphone app which would provide an experience more like practicing with an instrument. By keeping a pair of earbuds to hand I'd be able to practice whenever I wanted to, even with only two minutes to spare, and unlike on an instrument I could display the names of the notes so I could be confident of getting them right and free up my brain to concentrate on building associations between sounds and note names.

Initially I was concerned that it would be too easy to play mindlessly and I experimented with various ways of randomizing the layout to force the user to think about the notes being played. Over time I came to realize that the benefits of an easy to use fixed layout outweighed the disadvantage of potentially slipping into just fooling around and I came up with the approach now used in Solfetta.

## The principle of Solfetta

The essential idea of Solfetta is simple: use the note buttons to play by ear and use the labels on the notes to help you stay connected to the musical meaning of what you're playing. So I might play the first few notes of Frere Jacques, starting on Do, and in my head I'm hearing "Do-Re-Mi-Do" sung along to the tune. Spend enough time playing music like this and you start to hear the note names in your head automatically.

Does this really work? I can confidently say working with the app has made my ear a lot stronger. It's too early to say whether or not it'll ultimately get me to where I want to be (and I've used a lot of my spare time getting Solfetta ready to release instead of working with it!), but I'm optimistic. Try for yourself and see!

## Finding Do and determining the first note

If you're going to play a song using Solfa or note names you are going to want to start on the right note (of course mistakes will happen and aren't a big deal). Generally speaking Do will be the note that feels "final", and it will usually be the last note in a melody. To find the note the melody starts on I find it useful to imagine the melody finishing on Do and then starting again.

Practising with the example melodies accessed via the melody button should improve your ability to find Do and start on the right syllable.

If you're trying to match a piece of music you can listen for the note that feels final, find it in the notes view and then set it as Do. You may need to convert between different spellings of the same note to do this, for example you might find that for your piece of music Do is currently the note shown as B# on your notes view, but this will not be shown as an option for Do, you'll need to pick the enharmonic equivalent C.

## Basic use

### Layout

Solfetta will adjust its layout to fit the dimensions of your screen. Try rotating your device!

When you start Solfetta you will see a grid containing solfa symbols and five buttons underneath. The three buttons on the left switch between Intervals mode, Solfa mode and Notes mode. The same button will play the same note in each of these three modes, only the labels change. On the right hand side you will find a Melody button and a Solfetta button.

The notes in the playing area are arranged so that there is a semitone separating each note button and the button to the right of it. If there is no button to the right, we move to the next row up. This means that the highest notes are at the top of the display and the lowest notes are at the bottom. This layout may be somewhat familiar to guitar players.

If highlighting is enabled, notes that are not in the currently selected key will be displayed using a different colour. You can also choose to highlight in C Major / A Minor instead of the currently selected key so that the highlights reflect white keys vs black keys.

### Intervals mode

In intervals mode the button labels show the interval between the note last played and the note that will be played if the button is pressed, using standard abbreviations. Of course this means that the labels will change every time a new note is played. This takes a bit of getting used to but provides the ability to gain more confidence with intervals by picking out tunes by ear.

Interval names are a bit of a mouthful to sing. I experimented a bit with alternative singable names but ultimately decided that that would be overcomplicating things. I think there are two viable approaches, either play slowly enough that you can actually sing "perfect fourth" or "major third" for a single note without a problem, or focus on developing an association between the sound and the appearance of the abbreviation as it appears on the display.

One fun thing about this mode is that if you turn off the highlighting then it is effectively "keyless". You can start playing anywhere you want and it won't be the wrong note relative to Do, because there isn't a Do. If the music you're playing modulates to a different key there's no need to stop and change the key setting.

You'll see blank spaces in this mode sometimes as Solfetta doesn't label any notes that are more than two octaves away from the last note.

### Solfa mode

This is the default initial mode of the application. It shows standard solfa symbols representing scale degrees of the currently selected key. You can configure the app to display just ascending syllables, just descending syllables, or both. By default only descending syllables are shown.

The "proper" way to sing solfa is to use the ascending syllable e.g. "fi" for accidentals when the next note is higher and the descending syllable e.g. "se" when the next note is lower. I started off practising this way, eventually decided it was too much of a pain and have so far not regretted switching to just using the descending ones. I am fairly confident that it'll would be relatively easy to switch back to using both versions if I ever wanted to. Of course if you're using Solfetta to support some kind of formal instruction you'll want to stick to the system you use in your class.

### Notes mode

In this mode, the button labels show the musical notes as they are named in your currently selected key.

I initially thought that the thing to do would be to "master" solfa and then move on to learning the mapping of solfa syllables to note names for each key. In practice I've found that after getting quite good at solfa I wanted to move towards mapping solfa directly onto my instrument in a given key without focusing on note names all that much. Nevertheless I think there will be times when the notes mode is still useful.

Accidentals are shown using sharps in keys where the key signature contains sharps and flats where the key signature contains flats. This is a compromise over the proper approach of flattening on the way down and sharpening on the way up but it reduces clutter and I think it's sufficient for ear training.

### Tips

When you play a note it will sound until you lift your finger, even if you slide your finger off the button. This makes it possible to sound all the notes of a chord at the same time.

You will hopefully find that music from your device can be played while you use Solfetta (you may need to use the pop up music player controls on your phone to achieve this instead of switching between apps). This means that you can play along with it! The sound, volume and tuning controls in the Audio settings can be used to match Solfetta to the music. I highly recommend this as a way to keep your ear training interesting.

## Melody button

When I started showing Solfetta to members of my family I learned that they found it difficult to get started with. I decided to add the ability for the app to guide the user through some well known tunes. These are accessed through the melody button (&#9835;). You can click through and preview tunes to work on and then you have three difficulty level options.

In easy mode a yellow highlight shows you every note you need to play. In medium mode you see all the names of the notes in each section before you play it but only the first one is highlighted. In hard mode you are not provided with the names of the notes in the melody (but the first note will still be highlighted). If you make a mistake Solfetta will go back to highlighting the first note.

One fun thing about this feature is that it respects your currently selected display mode and key. So you can see e.g. the notes of Frere Jacques when played in any major key, or have the tune displayed as a sequence of intervals.

If you are showing both ascending and descending solfa syllables Soletta will attempt to use the right one for any accidentals.

## Settings

### Changing the key

The top two Settings buttons enable the current key to be configured. The button on the left enables the root note to be selected and the button on the right allows you to choose between Major and Minor tonality. By default Solfetta uses Do-based minor but this can be configured in the Display settings. In Do-based minor, the root note is Do and the notes in the key (in the solfa view) will include Me, Le, and Te. In La-based minor the solfa syllables are the same in major and minor keys, but the root note in minor keys is La instead of Do.

### Audio settings

The tuning setting allows fine adjustment of the tuning of the app, meaning that you can play along with music that was not recorded at A=440Hz. I would recommend changing back to A=440Hz when finished.

The relative volume of Solfetta can be changed, which is helpful for playing along with music on your phone.

You can choose between a number of different FM synthesized sounds provided by the [webaudio-tinysynth](https://github.com/g200kg/webaudio-tinysynth) library.

I've not been able to prevent iOS from sometimes rendering the current WebAudio context unusable (for example this can happen when an alarm sounds when you're using Solfetta, and so there is a "Fix Audio" button that can be used to reload the app when it's being run using its own home screen icon and no browser controls are available.

### Display settings

The display settings are mostly self-explanatory although you may want to look up the differences between do-based and la-based minor. It's worth noting that you can completely hide the labels, or have them just show when you press a button, if you want.

## Development

Solfetta is just a collection of static files but because ES6 modules are being used you will need to start a webserver to serve the app. After the initial `npm install` step, you can do this with `npm start`.  When it's running you can access Solfetta at `http://localhost:3000/src/index.html`. You can run the Webpack/Babel workflow that minifies the JavaScript and CSS with `npm run build`, which will generate the distribution files in the `dist` directory.

I am mostly a back end developer and haven't worked a lot in node, so some of what I've done here may be a bit unconventional (most people would have used a framework!). However, I've tried to include a decent number of comments for anyone who wants to experiment with changes.
