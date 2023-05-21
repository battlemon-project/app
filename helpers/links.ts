export default function clientLink() {
  let link =
    'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1l9zMZdrYpr52NC-DClfMnHsLdkLdfMKR';
  if (navigator.platform.indexOf('Mac') > -1) {
    link =
      'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1id5C6Aot1bPghHxtGt3b0RtFjWBEYOGS';
  }
  return link;
}
