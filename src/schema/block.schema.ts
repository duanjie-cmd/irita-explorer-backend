import * as mongoose from 'mongoose';
import { IBlockStruct } from '../types/schemaTypes/block.interface';
import { queryBlockState } from '../constant'
export const BlockSchema = new mongoose.Schema({
    height: Number,
    hash: String,
    txn: Number,
    time: Number,
}, { versionKey: false });

BlockSchema.statics = {
    async findList(state: string,blockHeight:number,pageSize: number): Promise<IBlockStruct[]> {
        let result: IBlockStruct[];
        switch (state) {
            case queryBlockState.first:
                result = await this.find({height: {$lte: blockHeight,$gt: blockHeight - pageSize }})
                break;
            case queryBlockState.end:
                console.log(state)
                result = await this.find({height: {$gte: blockHeight,$lt: blockHeight + pageSize}})
                break;
            case queryBlockState.prev:
                result = await this.find({height: {$gt:blockHeight,$lte: blockHeight + pageSize}})
            break;
            case queryBlockState.after:
                result = await this.find({height: {$lt: blockHeight,$gte: blockHeight - pageSize}})
                break;
            default:
                result = await this.find({height: {$lte: blockHeight,$gt: blockHeight - pageSize }})
                break;
        }
        console.log(state,blockHeight,pageSize,{height: {$gte: blockHeight,$lt: blockHeight + pageSize}})
        return result
    },

    async findHeightByParam(param: number): Promise<number> {
        let result = await this.find({}).sort({ height: param }).limit(1);
        let height = result && result[0] && result[0].height;
        return height;
    },

    async findCount(): Promise<number> {
        return await this.find({}).countDocuments().exec();
    },

    async findOneByHeight(height: number): Promise<IBlockStruct | null> {
        return await this.findOne({ height }).select({
            _id: 0,
            'txn-revno': 0,
            'txn-queue': 0,
        });
    },

    async findOneByHeightDesc(): Promise<IBlockStruct | null> {
        const res: IBlockStruct[] = await this.find({})
            .sort({ height: -1 })
            .select({
                _id: 0,
                'txn-revno': 0,
                'txn-queue': 0,
            })
            .limit(1);
        if (res && res.length > 0) {
            return res[0];
        } else {
            return null;
        }
    },

    async findNum100Height(): Promise<IBlockStruct | null> {
        const res: IBlockStruct[] = await this.find({})
            .select({
                _id: 0,
                'txn-revno': 0,
                'txn-queue': 0,
            })
            .sort({ height: -1 })
            .limit(100);
        if (res && res.length > 0) {
            return res[res.length - 1];
        } else {
            return null;
        }
    },


};