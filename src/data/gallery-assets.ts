export const GALLERY_IMAGES = [
  // Unsplash IDs used in Gallery
  'photo-1558905617-1545cf21a97c',
  'photo-1592419044706-39796d40f98c',
  'photo-1600607687920-4e2a09cf159d',
  'photo-1598901861713-54ad16a7e70e',
  'photo-1584473457406-623048fc437e',
  'photo-1466781783364-391eaf53cf39',
  'photo-1557428807-6ba07633276b',
  'photo-1590682847059-69d74259727a',
  'photo-1621932953986-15fcf084da0f',
  'photo-1585320806297-9794b3e4eeae',
  'photo-1600585154340-be6161a56a0c',
  'photo-1541888941295-65c82860a480',
  'photo-1418985991508-e47386d96a71',
  'photo-1478131143081-80f7f84ca84c',
  'photo-1517299321609-52687d1bc55c',
  'photo-1483921020237-2ff51e8e4b22',
  'photo-1521401830884-6c03c1c87ebb',
  // Specific URLs
  'https://i5.walmartimages.com/seo/Ktaxon-29x18in-Adjustable-T-Handle-Snow-Plow-with-Wheels-Heavy-Duty-Manual-Snow-Shovel-for-Driveway-Sidewalk-Blue-Black_6685080c-88bb-461d-a68f-3a14f63c5255.9959cd2f209a96c13c87eca8ad640a76.jpeg',
  'https://i.ytimg.com/vi/YOLNNAxvqy0/maxresdefault.jpg',
  'https://i.ytimg.com/vi/jjcx70og7to/maxresdefault.jpg'
];

export const prefetchImages = (images: string[]) => {
  images.forEach((item) => {
    const url = item.startsWith('http') 
      ? item 
      : `https://images.unsplash.com/${item}?auto=format&fit=crop&q=80&w=800`;
    
    const img = new Image();
    img.src = url;
  });
};
