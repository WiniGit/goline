class EnumObj {
    // only for ctrlz
    static skin = 0;
    //
    static wBase = 1;
    static attribute = 2;
    static style = 3;
    static autoLayout = 4;
    static cate = 5;
    static type = 6;
    static project = 7;
    static User = 8;
    static variant = 9;
    static frame = 10;
    static typoStyleFramePosition = 11;
    static border = 12;
    static decoration = 13;
    static effect = 14;
    static wBaseAttribute = 15;
    static paddingPosition = 17;
    static position = 19;
    static color = 20;
    static team = 21;
    static database = 22;
    static autoLayoutPosition = 23;
    static field = 24;
    static package = 25;
    static userTeam = 26;
    static userProject = 27;
    static textStyle = 28;
    static basePosition = 29;
    static textStyleFrame = 30;
    static attributeFrame = 31;
    static textStyleFramePosition = 32;
    static framePosition = 33;
    static urPermissions = 34;
    static page = 35;
    static customer = 36;
    static customerPage = 37;
    static customerTeam = 38;
    static customerProject = 39;
    static baseFrame = 40;
    static collection = 41;
    static request = 42;
    static attributePosition = 43;
    static table = 44;
    static baseDecoration = 45;
    static file = 46;
    static attributeDecoration = 47;
    static autoLayoutFrame = 48;
    static basePositionFrame = 49;
    static decoStyle = 50;
    static typoStyleItem = 51;
    static typoStyleFrame = 52;
    static autoLayoutFramePosition = 53;
    static unDeleted = 54;
    static apiInput = 55;
    static apiOutput = 56;
    static router = 57;
    static apilist = 58;
    static padddingWbaseFrame = 59;
}
class EnumEvent {
    static edit_delete = -1;
    static copy = 0;
    static add = 1;
    static edit = 2;
    static delete = 3;
    static unDelete = 4;
    static sort = 5;
    static parent = 6;
    static quay = 7;
    static init = 8;
    static get = 9;
    static permission = 10;
    static getProjectByID = 11;
    static getByCode = 12;
    static propertyBase = 13;
    static listBase = 14;
    static recycle = 15;
    static instance = 16;
    static verifyPhone = 17;
    static registor = 18;
    static verifyAuthen = 19;
    static merge = 20;
    static select = 21;
    static leave = 22;
    static editcode = 23;
    static joinbycode = 24;
    static Save = 25;
    static getProjectByIDapi = 26;
    static check = 27;
    static create = 28;
    static editRouter = 29;
}

class WEnum {
    static field = 1;
    static list = 2;
    static obj = 3;
    static enumDataType(type) {
        switch (type) {
            case field:
                return 'Field';
            case list:
                return 'List';
            case obj:
                return 'Obj';
            default:
                return '';
        }
    }
}