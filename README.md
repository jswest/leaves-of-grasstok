# Leaves of Grasstok

## What is this?

This is a Tiktok-style interface to explore Walt Whitman's amazing multi-part book of poems, _Leaves of Grass_ (one of my favorites). It was inspired by [Wikitok](https://wikitok.vercel.app/).

It uses a mutli-modal ML model called CLIP to "embed" chunks of the poem (ideally stanzas) as well as images from the Depression-era FSA [photo collection](https://www.loc.gov/pictures/collection/fsa/) at the Library of Congress. Then it displays more like what you seem to be drawn to, associating dwell time with interest.

The background color reflects your position in the embedding space.

Too often, AI and the humanities are presented as at odds. Too often, they _are_ at odds. This is an attempt to show how they can actually create something really cool when put together.

## Installation

```bash
git clone git@github.com:jswest/leaves-of-grasstok.git

pyenv install 3.12
pyenv local 3.12
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

nvm use 20
npm install
```

## Notes

The notebook where I embedded everything is in `scripts/grasstok.ipynb`.

Everything else is in the `src` folder. It's a bit of a mess.

To see how I got those images, see this repository [here](https://github.com/jswest/nicar2024-select-star).