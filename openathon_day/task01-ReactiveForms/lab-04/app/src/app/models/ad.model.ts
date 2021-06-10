export interface Ad {
  id: string;
  name: string;
  description: string;
  imageRef: string;
}

export function initializeAd(ad?): Ad {
  let newEvent: Ad = {
    id: ad ? ad.id : "",
    name: ad ? ad.name : "",
    imageRef: ad ? ad.name : "",
    description: ad ? ad.name : "",
  };
  return newEvent;
}
