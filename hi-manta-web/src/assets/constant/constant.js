const RoleType = {
  student: 1,
  couch: 2,
  admin: 3,
};

const RoleMap = {
  1: 'student',
  2: 'couch',
  3: 'admin',
};

const MediaType = {
  image: 1,
  video: 2,
};

const MediaMap = {
  1: '圖片',
  2: '影片',
};

const MedalType = {
  1: '課程等級',
  2: 'PB 蒐集',
  3: '怪奇系統',
  4: '潛點紀錄',
};

const PrizeType = {
  1: '潛旅',
  2: '裝備',
};

const Pattern = {
  EMAIL: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
};

const ErrorCode = {
  UNVERIFIED: 1004,
};

export { Pattern, ErrorCode, RoleType, MediaType, RoleMap, MediaMap, MedalType, PrizeType };
